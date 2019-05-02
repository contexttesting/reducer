export {}

/* typal types/reducer.xml closure noSuppress */
/**
 * @typedef {_contextTesting.ReducerConfig} ReducerConfig `@record` The options for the reducer.
 */
/**
 * @typedef {Object} _contextTesting.ReducerConfig `@record` The options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {function(!_contextTesting.Test): !Promise} runTest The function that wraps around `@zoroaster/reducer.runTest` method.
 * @prop {function(!_contextTesting.TestSuite, boolean): !Promise<!_contextTesting.TestSuite>} runTestSuite The function used to run a test suite. The second argument receives whether only focused tests should be run within this test suite.
 */
/**
 * @typedef {import('@zoroaster/types').Test} _contextTesting.Test
 */
/**
 * @typedef {import('@zoroaster/types').TestSuite} _contextTesting.TestSuite
 */

/* typal types/run-test.xml closure noSuppress */
/**
 * @typedef {_contextTesting.RunTestOptions} RunTestOptions Options for the `runTest` method.
 */
/**
 * @typedef {Object} _contextTesting.RunTestOptions Options for the `runTest` method.
 * @prop {!Array<*>} [context] The contexts to evaluate.
 * @prop {!Function} fn The function to execute.
 * @prop {!Array<*>} [persistentContext] Evaluated persistent contexts that will come before other contexts.
 * @prop {?number} [timeout="null"] The timeout to run the test and evaluate/destroy contexts within. Default `null`.
 * @prop {function(!stream.Writable)} [onCatchment] The callback that will be called with the _Catchment_ stream if the test returned a stream. The stream's data will be collected into the catchment to create the result as a string. The callback can be used to emit errors on the _Catchment_ stream.
 */
/**
 * @typedef {_contextTesting.RunTestResult} RunTestResult The result of the runTest function.
 */
/**
 * @typedef {Object} _contextTesting.RunTestResult The result of the runTest function.
 * @prop {Date} started The date when the test started.
 * @prop {Date} finished The date when the test finished.
 * @prop {Error} [error="null"] The error which happened during the test. Default `null`.
 * @prop {*} [result="null"] The result which the test returned. Default `null`.
 * @prop {*} [destroyResult="null"] The result which the destroy method on the context returned. Default `null`.
 */
/**
 * @typedef {import('stream').Writable} stream.Writable
 */
