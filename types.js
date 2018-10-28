export {}

/* documentary types/reducer.xml */
/**
 * @typedef {Object} Config Options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {(test: Test) => Promise.<*>} runTest The function used to run a test. It will receive `name`, `context`, `fn`, and `timeout` properties.
 * @prop {(testSuite: TestSuite) => Promise.<*>} runTestSuite The function used to run a test suite. It will receive `name`, `tests` and `onlyFocused` properties.
 *
 * @typedef {Object} TestSuite
 * @prop {string} name The name of the test suite.
 * @prop {Test[]} tests Tests.
 * @prop {boolean} onlyFocused Run only focused tests.
 */

/* documentary types/run-test.xml */
/**
 * @typedef {Object} RunTest Options for the runTest function.
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
 * @typedef {Object} Test The test type as used by the reducer.
 * @prop {number} name The name of the test.
 * @prop {function} fn The test function to run.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {boolean} [isFocused=false] If the test is focused. Default `false`.
 * @prop {boolean} [isSelfFocused] The property of the test suite such that it is focused.
 * @prop {boolean} [hasFocused] Whether the test suite has focused tests.
 */

/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */