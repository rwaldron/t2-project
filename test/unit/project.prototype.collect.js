exports['Project.prototype.collect'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
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
    this.project.collect(function(error, entries) {

      test.equal(error, null);

      ['a', 'b', 'c', 'index'].forEach((name) => {
        test.ok(entries.find(entry => entry.id.endsWith(name + '.js')));
      });

      test.done();
    });
  },

  removesExcludedFiles: function(test) {
    test.expect(6);

    this.project.exclude(['b.js', 'c.js']);

    this.project.collect(function(error, entries) {

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

    this.project.collect(function(error, entries) {

      test.equal(error, null);

      var expected = [
        '/package.json',
        '/node_modules/math-euler/package.json',
        '/node_modules/math-euler/euler.js',
        '/index.js',
      ];

      test.equal(entries.length, 4);

      expected.forEach((name) => {
        test.ok(entries.find(entry => entry.id.endsWith(name)), name);
      });
      test.done();
    });
  },
};