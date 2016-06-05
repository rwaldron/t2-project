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
    test.expect(1);

    var expected = [
      'a.js', '/../../t2-project/a.js', 'b.js', '/../../t2-project/b.js'
    ].map(path.normalize);

    this.project.exclude({
      files: ['a.js', 'b.js'],
      basedir: '../eg/project-simple'
    });

    test.deepEqual(this.project.excluded, expected);
    test.done();
  },

};
