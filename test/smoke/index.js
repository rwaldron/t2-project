var Project = require("../../");

var a = new Project({
  main: './eg/project-uses-socket-io/index.js'
});

a.graph(function(entries) {
  console.log("DONE: a", entries.length);
  console.log(entries);
});


var b = new Project({
  main: './eg/project-simple/index.js'
});

b.graph(function(entries) {
  console.log("DONE: b", entries.length);
  console.log(entries);
});
