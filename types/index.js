export {}

/* typal types/reducer.xml closure noSuppress */
/**
 * @typedef {_contextTesting.ReducerConfig} ReducerConfig `@record` The options for the reducer.
 */
/**
 * @typedef {Object} _contextTesting.ReducerConfig `@record` The options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {function(!_contextTesting.Test): !Promise} runTest The function that wraps around `@zoroaster/reducer.runTest` method.
 * @prop {function(!_contextTesting.TestSuite, boolean): !Promise<!_contextTesting.TestSuite>} runTestSuite The function used to run a test suite. The second argument receives whether the test suite has focused.
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
 * @typedef {import('@zoroaster/types').Test} _contextTesting.Test
 */
/**
 * @typedef {import('@zoroaster/types').TestSuite} _contextTesting.TestSuite
 */

