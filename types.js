export {}

/* documentary types/reducer.xml */
/**
 * @typedef {Object} Config Options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {function} notify The notify function to be passed to run method.
 */

/* documentary types/run-test.xml */
/**
 * @typedef {Object} RunTest Options for the runTest function.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {function} fn The test function to run.
 */

/* documentary types/test.xml */
/**
 * @typedef {Object} Test The test type as used by the reducer.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {number} name The name of the test.
 * @prop {boolean} [isFocused=false] If the test is focused. Default `false`.
 * @prop {boolean} [isTest=true] If it is a test and not a test suite. Default `true`.
 * @prop {boolean} [isSelfFocused] The property of the test suite such that it is focused.
 * @prop {boolean} [hasFocused] Whether the test suite has focused tests.
 * @prop {function} fn The test function to run.
 */

/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */