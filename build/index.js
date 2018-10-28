const _runTest = require('./lib/run-test');
const _reducer = require('./lib/reducer');

/**
 * Asynchronously runs the test within a timeout limit. Evaluates the contexts beforehand and destroys them after.
 * @param {Test} test The test structure used in `runTest`.
 * @param {function} test.fn The test function to run.
 * @param {ContextConstructor[]} [test.context] Any context constructors for the test to be evaluated.
 * @param {number} [test.timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 */
const runTest = (test) => _runTest(test)

/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test and !test suite
 * @param {TestOrTestSuite[]} tests An array with tests to reduce.
 * @param {Config} config Options for the reducer.
 * @param {boolean} [config.onlyFocused=false] Run only focused tests. Default `false`.
 * @param {(test: { fn: function }) => Promise.<*>} config.runTest The function used to run a test.
 * @param {(testSuite: {}, onlyFocused: boolean) => Promise.<TestSuiteLite>} config.runTestSuite The function used to run a test suite.
 * @returns {Promise.<TestSuiteLite>} A recursive map of tests (jsdoc max 3 levels).
 *
 * @example
 * type TestOrTestSuite = {
 *   context?: (new (...args: any[]) => Context)[];
 *   timeout?: number;
 *   name: number;
 *   isFocused?: boolean;
 *   hasFocused?: boolean;
 *   fn: Function;
 * }
 */
const reducer = (tests, config) => _reducer(tests, config)


module.exports=reducer

/* documentary node_modules/@zoroaster/types/types/context.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 *
 * @typedef {{new(...args: any[]): Context}} ContextConstructor A function or class or object that makes a context
 */

/* documentary types/run-test.xml */
/**
 * @typedef {Object} RunTestResult The result of the runTest function.
 * @prop {Date} started The date when the test started.
 * @prop {Date} finished The date when the test finished.
 * @prop {Error} [error="null"] The error which happened during the test. Default `null`.
 * @prop {*} [result="null"] The result which the test returned. Default `null`.
 * @prop {*} [destroyResult="null"] The result which the destroy method on the context returned. Default `null`.
 *
 * @typedef {Object} Test The test structure used in `runTest`.
 * @prop {function} fn The test function to run.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 */

/* documentary types/test.xml */
/**
 * @typedef {Object} TestOrTestSuite The test or test suite (determined by the presence of the `fn` property).
 * @prop {string} name The name of the test or a test suite.
 * @prop {function} [fn] The test function to run.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {boolean} [isFocused=false] If the test or test suite is focused. Default `false`.
 * @prop {boolean} [hasFocused] Whether the test suite has focused tests.
 */

/* documentary types/reducer.xml */
/**
 * @typedef {Object} Config Options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {(test: { fn: function }) => Promise.<*>} runTest The function used to run a test.
 * @prop {(testSuite: {}, onlyFocused: boolean) => Promise.<TestSuiteLite>} runTestSuite The function used to run a test suite.
 *
 * @typedef {Object} TestSuite The structure which will be passed to the `runTestSuite` method.
 * @prop {string} name The name of the test suite.
 * @prop {Test[]} tests The tests and test suites to reduce.
 *
 * @typedef {Object.<string, Test|Object.<string, Test|Object.<string, Test>>>} TestSuiteLite An recursive tree returned by the reducer containing either nested test suites or tests updated with the outcome of the runTest method (not pure since the test methods passed are mutated).
 */


module.exports.runTest = runTest