var Project = require('../../');

var c = new Project({
  entry: './eg/project-has-browser/index.js',
});

c.collect((error, entries) => {
  entries.forEach(entry => {
    var evaluated;

    if (entry.file.endsWith('package.json')) {
      evaluated = JSON.parse(entry.source);
      console.log(evaluated);
    }
  });
});
