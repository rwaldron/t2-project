exports['Project'] = {
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

  missingOptions: function(test) {
    test.expect(1);
    test.throws(() => {
      new Project();
    });
    test.done();
  },

  missingEntry: function(test) {
    test.expect(1);
    test.throws(() => {
      new Project({});
    });
    test.done();
  },

  invalidEntry: function(test) {
    test.expect(3);
    test.throws(() => {
      new Project({
        entry: null
      });
    });

    test.throws(() => {
      new Project({
        entry: 1
      });
    });

    test.throws(() => {
      new Project({
        entry: false
      });
    });

    test.done();
  },

  mainInferred: function(test) {
    test.expect(2);
    test.equal(this.project.main.startsWith(process.cwd()), true);
    test.equal(this.project.main.endsWith(path.normalize('eg/project-simple/index.js')), true);
    test.done();
  },

  dirnameInferred: function(test) {
    test.expect(2);
    test.equal(this.project.dirname.startsWith(process.cwd()), true);
    test.equal(this.project.dirname.endsWith(path.normalize('eg/project-simple')), true);
    test.done();
  },

  dirnameExplicit: function(test) {
    test.expect(2);

    var dirname = path.join(process.cwd(), 'eg/project-simple/');

    this.project = new Project({
      entry: path.join(process.cwd(), 'eg/project-simple/example/index.js'),
      dirname: dirname,
    });

    test.equal(this.project.main.startsWith(process.cwd()), true);
    test.equal(this.project.dirname, dirname);
    test.done();
  },

  deps: function(test) {
    test.expect(4);
    test.equal(this.project.deps instanceof Dependencies, true);
    test.equal(this.project.deps.options.ignoreMissing, true);
    test.deepEqual(this.project.deps.options.extensions, ['.js', '.json']);
    test.equal(this.project.deps.options.filter.length, 1);
    test.done();
  },

};
