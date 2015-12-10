var Project = require('../../');

var a = new Project({
  entry: './eg/project-uses-socket-io/index.js',
});

a.collect(function(error, entries) {
  console.log('DONE: a', entries.length);
  entries.forEach(entry => {
    if (entry.file.endsWith('package.json')) {
      console.log(entry.file);
    }
  });
});


var b = new Project({
  entry: './eg/project-simple/index.js',
});

b.collect(function(error, entries) {
  console.log('DONE: a', entries.length);
  entries.forEach(entry => {
    if (entry.file.endsWith('package.json')) {
      console.log(entry.file);
      console.log(entry.source);
    }

  });
  // console.log(entries);
});




// var c = new Project({
//   entry: './eg/project-conditional/index.js',
// });

// c.exclude(['b.js']);
// c.exclude(['c.*']);

// var p = c.collect(function(error, entries) {
//   console.log('CALLBACK: c', entries.length);
//   console.log(entries);
// });

// p.then(entries => {
//   console.log('RESOLVED: c', entries.length);
//   console.log(entries);
// });
