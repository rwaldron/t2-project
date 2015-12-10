var Project = require('../../');

var b = new Project({
  entry: './eg/project-simple/index.js',
});

b.collect(function(error, entries) {
  console.log('DONE: a', entries.length);
  entries.forEach(entry => console.log(entry.file));
});

var c = new Project({
  entry: './eg/project-conditional/index.js',
});

c.exclude(['b.js']);
c.exclude(['c.*']);

var p = c.collect(function(error, entries) {
  console.log('CALLBACK: c', entries.length);
  entries.forEach(entry => console.log(entry.file));
});

p.then(entries => {
  console.log('RESOLVED: c', entries.length);
  entries.forEach(entry => console.log(entry.file));
});
