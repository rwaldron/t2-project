exports['Project.prototype.collect'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.globSync = this.sandbox.spy(glob, 'sync');
    this.project = new Project({
      entry: path.join(process.cwd(), 'eg/project-conditional/index.js'),
    });
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  returnsPromise: function(test) {
    test.expect(5);
    var p = this.project.collect();

    test.equal(p instanceof Promise, true);

    p.then((entries) => {
      ['a', 'b', 'c', 'index'].forEach((name) => {
        test.ok(entries.find(entry => entry.id.endsWith(name + '.js')));
      });
      test.done();
    });
  },

  acceptsCallback: function(test) {
    test.expect(5);
    this.project.collect((error, entries) => {

      test.equal(error, null);

      ['a', 'b', 'c', 'index'].forEach((name) => {
        test.ok(entries.find(entry => entry.id.endsWith(name + '.js')));
      });

      test.done();
    });
  },

  removesExcludedFiles: function(test) {
    test.expect(11);

    this.project.exclude(['b.js', 'c.js']);

    this.project.collect((error, entries) => {
      test.equal(this.globSync.callCount, 4);
      test.equal(this.globSync.getCall(0).args[0], 'b.js');
      test.equal(this.globSync.getCall(1).args[0], '/b.js');
      test.equal(this.globSync.getCall(2).args[0], 'c.js');
      test.equal(this.globSync.getCall(3).args[0], '/c.js');

      test.equal(error, null);
      test.equal(entries.length, 2);
      ['a', 'index'].forEach((name) => {
        test.ok(entries.find(entry => entry.id.endsWith(name + '.js')));
      });

      // These will not be present
      ['b', 'c'].forEach((name) => {
        test.equal(entries.find(entry => entry.id.endsWith(name + '.js')), undefined);
      });

      test.done();
    });
  },
};


exports['Project.prototype.collect Collates Package.json'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.globSync = this.sandbox.spy(glob, 'sync');
    this.project = new Project({
      entry: path.join(process.cwd(), 'eg/project-has-browser/index.js'),
    });
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  collatesPackageJson: function(test) {
    test.expect(10);
    var expect = [
      'project-simple',
      'engine.io-parser',
      'after',
      'utf8',
    ];
    this.project.collect((error, entries) => {
      entries.forEach(entry => test.ok(expect.includes(entry.packageName)));
      test.done();
    });
  },

};

exports['Project.prototype.collect with node_modules'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.project = new Project({
      entry: path.join(process.cwd(), 'eg/project-simple/index.js'),
    });
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  providesPackageJson: function(test) {
    test.expect(6);

    this.project.collect((error, entries) => {

      test.equal(error, null);

      var expected = [
        '/package.json',
        '/node_modules/math-euler/package.json',
        '/node_modules/math-euler/euler.js',
        '/index.js',
      ].map(path.normalize);

      // console.log('expected', expected);
      // console.log('entries', entries);
      test.equal(entries.length, 4);

      expected.forEach((name) => {
        test.ok(entries.find(entry => entry.id.endsWith(name)), name);
      });
      test.done();
    });
  },
};

exports['Project.prototype.collect does not resolve "browser" key in package.json'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.project = new Project({
      entry: path.join(process.cwd(), 'eg/project-has-browser/index.js'),
    });
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  browserDoesNotResolveToMain: function(test) {
    test.expect(12);

    this.project.collect((error, entries) => {

      test.equal(error, null);

      var expected = [
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
      ].map(path.normalize);
      test.equal(entries.length, expected.length);

      expected.forEach((name) => {
        test.ok(entries.find(entry => entry.id.endsWith(name)), name);
      });

      test.done();
    });
  },
};
