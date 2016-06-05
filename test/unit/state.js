exports['state'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.globSync = this.sandbox.spy(glob, 'sync');
    this.project = new Project({
      entry: path.join(process.cwd(), 'eg/project-filtering/index.js'),
    });
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  filters: {
    builtins: function(test) {
      test.expect(1);
      var p = this.project.collect();

      p.then((entries) => {
        entries.forEach(entry => {
          if (entry.file.endsWith('index.js')) {
            test.deepEqual(entry.deps, {
              sys: false,
              util: false
            });
          }
        });
        test.done();
      });
    },
  }
};
