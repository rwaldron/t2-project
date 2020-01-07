const conditional = true ? require('./a') : require('./b');

require('./c');


console.log(conditional());
