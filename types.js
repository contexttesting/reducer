export {}

/* documentary types/reducer.xml */
/**
 * @typedef {Object} Config Options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {(test: { fn: function }) => Promise.<*>} runTest The function used to run a test.
 * @prop {(testSuite: Object, onlyFocused: boolean) => Promise.<TestSuiteLite>} runTestSuite The function used to run a test suite.
 *
 * @typedef {Object.<string, Test|Object.<string, Test|Object.<string, Test>>>} TestSuiteLite An recursive tree returned by the reducer containing nested test suites with tests updated with the outcome of the `runTest` method (therefore, the reducer is not pure since the passed tests are mutated).
 */

/* documentary types/run-test.xml */
/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 *
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
 * @prop {boolean} [isFocused=false] If the test or test suite is focused. Default `false`.
 * @prop {boolean} [hasFocused] Whether the test suite has focused tests.
 */

/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */