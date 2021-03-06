const Project = require('../../');

const c = new Project({
  entry: './eg/project-has-browser/index.js',
});

const expected = [
  'project-has-browser/package.json',
  'project-has-browser/node_modules/engine.io-parser/package.json',
  'project-has-browser/node_modules/engine.io-parser/lib/keys.js',
  'project-has-browser/node_modules/engine.io-parser/node_modules/utf8/package.json',
  'project-has-browser/node_modules/engine.io-parser/node_modules/after/package.json',
  'project-has-browser/node_modules/engine.io-parser/node_modules/utf8/utf8.js',
  'project-has-browser/node_modules/engine.io-parser/node_modules/after/index.js',
  'project-has-browser/node_modules/engine.io-parser/lib/index.js',
  'project-has-browser/node_modules/engine.io-parser/index.js',
  'project-has-browser/index.js',
];
c.collect((error, {
  length
}) => {
  console.log('CALLBACK: c');
  console.log(expected.length === length ? 'PASS' : 'FAIL');

  // expected.forEach((name) => {
  //   console.log(entries.find(entry => entry.id.endsWith(name)), name);
  // });
});
