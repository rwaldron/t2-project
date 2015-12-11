# t2-project

Given a specified entry point file, determine and resolve the dependency graph. 

## Dependencies

The resulting output is an array of data objects containing the following properties: 

| Name | Description |
| ---- | ----------- |
| id | Unique file identity |
| file | Absolute path to file |
| source | The contents of the file |


For example, the following program: 

```js
var Project = require('t2-project');

var project = new Project({
  entry: 'eg/project-conditional/index.js',
});

project.exclude(['b.js']);
project.exclude(['c.*']);

project.collect((error, entries) => console.log(entries));
```

Where `eg/project-conditional/` contains: 

```
.
├── a.js
├── b.js
├── c.js
└── index.js

0 directories, 4 files
```

Would have the following result (just assume `${ABSOLUTE_PATH}` is the absolute path to `project-conditional`):

```
[{
  id: '${ABSOLUTE_PATH}/eg/project-conditional/a.js',
  source: 'module.exports = function() {\n  return \'a\';\n};\n',
  deps: {},
  file: '${ABSOLUTE_PATH}/eg/project-conditional/a.js'
}, {
  file: '${ABSOLUTE_PATH}/eg/project-conditional/index.js',
  entry: true,
  id: '${ABSOLUTE_PATH}/eg/project-conditional/index.js',
  source: 'var conditional = true ? require(\'./a\') : require(\'./b\');\n\nrequire(\'./c\');\n\n\nconsole.log(conditional());\n',
  deps: {
    './b': '${ABSOLUTE_PATH}/eg/project-conditional/b.js',
    './c': '${ABSOLUTE_PATH}/eg/project-conditional/c.js',
    './a': '${ABSOLUTE_PATH}/eg/project-conditional/a.js'
  }
}]
```


## Usage

Install via npm: 

```
npm install t2-project
```

```js
var Project = require('t2-project');

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
```



## API

- `exclude(file)`: Call this method with a string `file` name to exclude a single file. 
- `exclude([ ...files])`: Call this method with an array of string `file` names to exclude many files. 
- `exclude({ files: [ ...files], basedir: '...' })`: Call this method with an object containing a `files` property, whose value is an array of string `file` names to exclude many files; and optionally a `basedir` property to specify the base directory to exclude from.
- `filter`: meh, this is unfinished and might not live to see another day. 



## License

Copyright (c) 2015 Rick Waldron <waldron.rick@gmail.com>
Licensed under the MIT license.
