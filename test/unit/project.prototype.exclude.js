exports['Project.prototype.exclude'] = {
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

  excludeSingleFile: function(test) {
    test.expect(1);

    var expected = ['a.js', '/a.js'].map(path.normalize);

    this.project.exclude('a.js');

    test.deepEqual(this.project.excluded, expected);
    test.done();
  },

  excludeMultipleFiles: function(test) {
    test.expect(1);

    var expected = ['a.js', '/a.js', 'b.js', '/b.js'].map(path.normalize);

    this.project.exclude(['a.js', 'b.js']);

    test.deepEqual(this.project.excluded, expected);
    test.done();
  },

  excludeOptions: function(test) {
    test.expect(4);

    var expected = [
      'a.js', '/../../t2-project/a.js', 'b.js', '/../../t2-project/b.js'
    ].map(path.normalize);

    this.project.exclude({
      files: ['a.js', 'b.js'],
      basedir: path.normalize('../eg/project-simple')
    });

    var excluded = this.project.excluded;

    expected.forEach((name) => {
      test.ok(excluded.find(entry => entry.endsWith(name)), name);
    });

    test.done();
  },

};
