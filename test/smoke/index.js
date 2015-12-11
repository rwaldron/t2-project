var Project = require('../../');

var a = new Project({
  entry: './eg/project-simple/index.js',
});

a.collect((error, entries) => {
  console.log('DONE: a', entries.length);
  entries.forEach(entry => console.log(entry.file));
});

var b = new Project({
  entry: './eg/project-conditional/index.js',
});

b.exclude(['b.js', 'c.*']);

/*
Or...

b.exclude('b.js');
b.exclude('c.*');

Or...

b.exclude({
  files: ['b.js', 'c.*'],
  basedir: (optionally specify a basedir)
});
*/

var p = b.collect((error, entries) => {
  console.log('CALLBACK: b', entries.length);
  entries.forEach(entry => console.log(entry));
});

p.then(entries => {
  console.log('RESOLVED: b', entries.length);
  entries.forEach(entry => console.log(entry.file));
});
