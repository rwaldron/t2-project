global.IS_TEST_ENV = true;


// Built-ins
global.Emitter = require('events').EventEmitter;
global.fs = require('fs');
global.path = require('path');

// 3rd Party
require('array-includes').shim();

global.builtins = require('builtins');
global.Dependencies = require('module-deps');
global.glob = require('glob');
global.sinon = require('sinon');

global.Project = require('../../lib/');
