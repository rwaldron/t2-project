exports['Project.prototype.exclude'] = {
  setUp(done) {
    this.sandbox = sinon.createSandbox();
    this.project = new Project({
      entry: path.join(process.cwd(), 'eg/project-simple/index.js'),
    });
    done();
  },

  tearDown(done) {
    this.sandbox.restore();
    done();
  },

  excludeSingleFile(test) {
    test.expect(1);

    const expected = ['a.js', '/a.js'].map(path.normalize);

    this.project.exclude('a.js');

    test.deepEqual(this.project.excluded, expected);
    test.done();
  },

  excludeMultipleFiles(test) {
    test.expect(1);

    const expected = ['a.js', '/a.js', 'b.js', '/b.js'].map(path.normalize);

    this.project.exclude(['a.js', 'b.js']);

    test.deepEqual(this.project.excluded, expected);
    test.done();
  },

  excludeOptions(test) {
    test.expect(4);

    const expected = [
      'a.js', '/../../t2-project/a.js', 'b.js', '/../../t2-project/b.js'
    ].map(path.normalize);

    this.project.exclude({
      files: ['a.js', 'b.js'],
      basedir: path.normalize('../eg/project-simple')
    });

    const excluded = this.project.excluded;

    expected.forEach((name) => {
      test.ok(excluded.find(entry => entry.endsWith(name)), name);
    });

    test.done();
  },

};
