const euler = require('math-euler');
console.log('test');

console.log(euler);

module.exports = function() {
  return 1;
};

const a = {a: 1};
const b = {b: 2};
const c = {...a, ...b};
