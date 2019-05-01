const $_lib_run_test = require('./lib/run-test');
const $_lib_reducer = require('./lib/reducer');

const $_lib = require('./lib');

module.exports = $_lib_reducer
module.exports.runTest = $_lib_run_test
module.exports.evaluateContext = $_lib.evaluateContext
module.exports.destroyContexts = $_lib.destroyContexts