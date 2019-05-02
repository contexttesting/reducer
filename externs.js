/* typal types/reducer.xml externs */
/** @const */
var _contextTesting = {}
/**
 * The options for the reducer.
 * @record
 */
_contextTesting.ReducerConfig
/**
 * Run only focused tests.
 * @type {boolean|undefined}
 */
_contextTesting.ReducerConfig.prototype.onlyFocused
/**
 * The function that wraps around `@zoroaster/reducer.runTest` method.
 * @type {function(!_contextTesting.Test): !Promise}
 */
_contextTesting.ReducerConfig.prototype.runTest
/**
 * The function used to run a test suite. The second argument receives whether only focused tests should be run within this test suite.
 * @type {function(!_contextTesting.TestSuite, boolean): !Promise<!_contextTesting.TestSuite>}
 */
_contextTesting.ReducerConfig.prototype.runTestSuite

/* typal types/run-test.xml externs */
/**
 * Options for the `runTest` method.
 * @typedef {{ context: ((!Array<*>)|undefined), fn: !Function, persistentContext: ((!Array<*>)|undefined), timeout: ((?number)|undefined), onCatchment: ((function(!stream.Writable))|undefined) }}
 */
_contextTesting.RunTestOptions
/**
 * The result of the runTest function.
 * @typedef {{ started: Date, finished: Date, error: (Error|undefined), result: ((*)|undefined), destroyResult: ((*)|undefined) }}
 */
_contextTesting.RunTestResult
