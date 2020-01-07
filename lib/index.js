// Built-ins
const Emitter = require('events');
const path = require('path');

// 3rd Party
const builtins = require('builtins');
const Dependencies = require('module-deps');
const glob = require('glob');
const resolve = require('resolve');

const priv = new WeakMap();

/*
  Due to the naive static semantics of `module-deps`,
  anything required, even conditionally, will
  appear in the graph. In the case of the bug reported
  at https://github.com/tessel/t2-cli/issues/757,
  some modules appear to be conditionally including
  the long-removed `sys` built-in. We ignore the
  presence of built-ins by keying on the list created by
  the `builtins` module, but this fails when the
  built-in is any of the entries found in the `builtins`
  module's blacklisted entries. In the case of the report,
  that specifically means `sys`, which is conditionally
  required by https://www.npmjs.com/package/redis :(
*/
builtins.push(
  'sys'
);

class Project extends Emitter {
  constructor(options) {
    super();

    if (!options) {
      throw new Error('Expected options object.');
    }

    if (typeof options.entry !== 'string') {
      throw new Error('Expected options.entry to be a string.');
    }

    Object.assign(this, options);

    const state = {
      exclusions: [],
      files: [],
      names: {},
      filters: [
        file => !builtins.includes(file),
      ],
    };

    priv.set(this, state);

    this.deps = new Dependencies({
      ignoreMissing: true,
      extensions: ['.js', '.json'],
      filter: (file) => state.filters.every(filter => filter(file)),
      resolve: (id, options = {}, cb = () => {}) => {
        let base = path.dirname(options.filename);

        if (options.basedir) {
          base = options.basedir;
        }

        resolve(id, buildResolverOptions(options, base), (error, id, packageJson) => {
          if (typeof packageJson !== 'undefined') {
            state.names[id] = packageJson.name;
          }

          cb(error, id, packageJson);
        });
      }
    });

    this.main = path.resolve(this.entry);
    this.dirname = this.dirname || path.dirname(this.main);
  }

  get excluded() {
    return priv.get(this).exclusions.slice();
  }

  filter(predicate) {
    const state = priv.get(this);
    if (typeof predicate !== 'function') {
      throw new Error('Expected filter predicate to be a function.');
    }
    state.filters.push(predicate);
    return this;
  }

  exclude(exclusion) {
    const state = priv.get(this);
    let basedir = process.cwd();
    let files;

    if (Array.isArray(exclusion)) {
      files = exclusion;
    } else {
      if (typeof exclusion === 'string') {
        files = [exclusion];
      } else {
        if (typeof exclusion === 'object' && exclusion !== null) {
          files = exclusion.files || [];
          basedir = exclusion.basedir || basedir;
        }
      }
    }

    files.forEach((file) => {
      const relative = `/${path.relative(basedir, file)}`;

      if (!state.exclusions.includes(file) &&
        !state.exclusions.includes(relative)) {
        state.exclusions.push(
          // As-is
          path.normalize(file),
          // Relative-ized (for consistency with Browserify)
          path.normalize(relative)
        );
      }
    });

    return this;
  }

  async collect(callback) {
    const state = priv.get(this);
    const entries = [];

    // this.deps.end({
    //   file: this.main,
    //   entry: true,
    // });

    // this.deps.on('data', entry => entries.push(entry));
    // this.deps.on('end', () => callback(null, entries));

    const pending = [
      new Promise((resolve) => {
        const pending = state.exclusions.map(exclusion => new Promise((resolve) => {
          resolve(
            glob.sync(exclusion, {
              cwd: this.dirname
            }).map(found => path.join(this.dirname, found))
          );
        }));
        Promise.all(pending).then(results => resolve(results.reduce((a, b) => a.concat(b), [])));
      }),
      new Promise((resolve) => {
        this.deps.end({
          file: this.main,
          entry: true,
        });

        this.deps.on('package', pkg => {
          if (!pkg.__dirname.includes(this.dirname)) {
            return;
          }
          const file = path.join(pkg.__dirname, 'package.json');
          entries.push({
            id: file,
            file,
            source: JSON.stringify(pkg),
            packageName: pkg.name,
          });
        });
        this.deps.on('data', entry => {
          entry.packageName = state.names[entry.id];
          entries.push(entry);
        });
        this.deps.on('error', error => this.emit('error', error));
        this.deps.on('end', () => resolve(entries));
      }),
    ];

    const results = await Promise.all(pending);
    const exclusions = results[0];
    const files = results[1].filter(({
      file
    }) => !exclusions.includes(file));

    if (typeof callback === 'function') {
      callback(null, files);
    }
    return files;
  }
}

// Loosely based on an operation found in browser-resolve
function buildResolverOptions(options, base) {
  const pathFilter = options.pathFilter;

  options.basedir = base;
  options.pathFilter = function(info, resvPath, relativePath) {
    if (relativePath[0] !== '.') {
      relativePath = `./${relativePath}`;
    }
    let mappedPath;
    if (pathFilter) {
      mappedPath = pathFilter.apply(this, [info, resvPath, path.normalize(relativePath)]);
    }
    if (mappedPath) {
      return mappedPath;
    }
    return;
  };
  return options;
}


module.exports = Project;
