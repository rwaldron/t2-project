var cp = require("child_process");
var path = require("path");

console.log("process.cwd()", process.cwd());

Promise.all([
  "eg/project-simple",
  "eg/project-filtering",
  "eg/project-has-browser",
].reduce((accum, egpath) => {
  accum.push(
    new Promise((resolve, reject) => {
      cp.exec(`cd ${path.join(process.cwd(), egpath)}; npm install;`, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      })
    })
  );
  return accum;
}, [])).then(() => {
  process.exit(0);
}).catch(error => {
  console.log(error);
  process.exit(1);
});
