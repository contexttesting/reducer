import _runTest from './lib/run-test'

/**
 * Asynchronously runs the test within a timeout limit. Evaluates the contexts beforehand and destroys them after.
 * @param {RunTest} options Options for the runTest function.
 * @param {ContextConstructor[]} [options.context] Any context constructors for the test to be evaluated.
 * @param {number} [options.timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @param {function} options.fn The test function to run.
 */
const runTest = (options) => _runTest(options)

export { default } from './lib/reducer'

export { runTest }

/* documentary types/run-test.xml */
/**
 * @typedef {Object} RunTest Options for the runTest function.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {function} fn The test function to run.
 */
