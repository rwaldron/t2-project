exports['state'] = {
  setUp(done) {
    this.sandbox = sinon.createSandbox();
    this.globSync = this.sandbox.spy(glob, 'sync');
    this.project = new Project({
      entry: path.join(process.cwd(), 'eg/project-filtering/index.js'),
    });
    done();
  },

  tearDown(done) {
    this.sandbox.restore();
    done();
  },

  filters: {
    builtins(test) {
      test.expect(1);
      const p = this.project.collect();

      p.then((entries) => {
        entries.forEach(({
          file,
          deps
        }) => {
          if (file.endsWith('index.js')) {
            test.deepEqual(deps, {
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
