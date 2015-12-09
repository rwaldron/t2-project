// Built-ins
var Emitter = require("events").EventEmitter;
var path = require("path");

// 3rd Party
require("array-includes").shim();
var builtins = require("builtins");
var Dependencies = require("module-deps");

function Project(options) {
  Emitter.call(this);

  Object.assign(this, options);

  this.deps = new Dependencies({
    ignoreMissing: true,
    extensions: [ ".js", ".json" ],
    filter: function(file) {
      if (builtins.includes(file)) {
        return false;
      }
      return true;
    }
  });

  this.resolved = path.resolve(this.main);

  this.deps.on("error", (error) => {
    this.emit("error", error);
  });
}

Project.prototype = Object.create(Emitter.prototype, {
  constructor: {
    value: Project
  }
});

Project.prototype.graph = function(callback) {
  var entries = [];

  this.deps.end({
    file: this.resolved,
    entry: true,
  });

  this.deps.on("data", entry => entries.push(entry));
  this.deps.on("end", () => callback(entries));
};

module.exports = Project;
