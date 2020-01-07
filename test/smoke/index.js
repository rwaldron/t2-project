const Project = require('../../');

const a = new Project({
  entry: './eg/project-simple/index.js',
});

a.collect((error, entries) => {
  console.log('CALLBACK: a', entries.length === 4 ? 'PASS' : 'FAIL');
  entries.forEach(({
    file
  }) => console.log(file));
});

const b = new Project({
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

const p = b.collect((error, entries) => {
  console.log('CALLBACK: b', entries.length === 2 ? 'PASS' : 'FAIL');
  entries.forEach(entry => console.log(entry));
});

p.then(entries => {
  console.log('RESOLVED: b', entries.length === 2 ? 'PASS' : 'FAIL');
  entries.forEach(({
    file
  }) => console.log(file));
});
