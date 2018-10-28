const _runTest = require('./lib/run-test');
const _reducer = require('./lib/reducer');

/**
 * Asynchronously runs the test within a timeout limit. Evaluates the contexts beforehand and destroys them after.
 * @param {RunTest} options Options for the runTest function.
 * @param {function} options.fn The test function to run.
 * @param {ContextConstructor[]} [options.context] Any context constructors for the test to be evaluated.
 * @param {number} [options.timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 */
const runTest = (options) => _runTest(options)

/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test and !test suite
 * @param {Test[]} tests An array with tests to reduce.
 * @param {Config} config Options for the reducer.
 * @param {boolean} [config.onlyFocused=false] Run only focused tests. Default `false`.
 * @param {(test: Test) => Promise.<*>} config.runTest The function used to run a test. It will receive `name`, `context`, `fn`, and `timeout` properties.
 * @param {(testSuite: TestSuite) => Promise.<TestSuiteLite>} config.runTestSuite The function used to run a test suite. It will receive `name`, `tests` and `onlyFocused` properties.
 * @returns {Promise.<TestSuiteLite>}
 */
const reducer = (tests, config) => _reducer(tests, config)


module.exports=reducer

/* documentary types/run-test.xml */
/**
 * @typedef {Object} TestLite The test structure expected by `runTest`.
 * @prop {function} fn The test function to run.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 *
 * @typedef {Object} RunTestResult The result of the runTest function.
 * @prop {Date} started The date when the test started.
 * @prop {Date} finished The date when the test finished.
 * @prop {Error} [error="null"] The error which happened during the test. Default `null`.
 * @prop {*} [result="null"] The result which the test returned. Default `null`.
 * @prop {*} [destroyResult="null"] The result which the destroy method on the context returned. Default `null`.
 */

/* documentary types/test.xml */
/**
 * @typedef {Object} Test The test type which can also be a test suite. The reducer will check for the presence of the `fn` property to decide whether to run as a test or a test suite.
 * @prop {number} name The name of the test or a test suite.
 * @prop {function} fn The test function to run.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {boolean} [isFocused=false] If the test is focused. Default `false`.
 * @prop {boolean} [isSelfFocused] The property of the test suite such that it is focused.
 * @prop {boolean} [hasFocused] Whether the test suite has focused tests.
 */

/* documentary types/reducer.xml */
/**
 * @typedef {Object} Config Options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {(test: Test) => Promise.<*>} runTest The function used to run a test. It will receive `name`, `context`, `fn`, and `timeout` properties.
 * @prop {(testSuite: TestSuite) => Promise.<TestSuiteLite>} runTestSuite The function used to run a test suite. It will receive `name`, `tests` and `onlyFocused` properties.
 *
 * @typedef {Object.<string, Test|Object.<string, Test|Object.<string, Test>>>} TestSuiteLite An recursive tree returned by the reducer containing either nested test suites or tests updated with the outcome of the runTest method (not pure since the test methods passed are mutated).
 * @prop {string} name The name of the test suite.
 * @prop {Test[]} tests Tests.
 * @prop {boolean} onlyFocused Run only focused tests.
 */


module.exports.runTest = runTest