let promto = require('promto'); if (promto && promto.__esModule) promto = promto.default;
const { _evaluateContexts, destroyContexts } = require('.');

/**
 * Create a promise for a test function.
 * @param {function} fn function to execute
 * @param {object[]} ctx Contexts to pass as arguments in order
 * @return {Promise} A promise to execute function.
 */
// async function createTestPromise(fn, contexts) {
//   const res = await
//   return res
// }

/**
 * Asynchronously runs the test
 * @param {Run} options Options for the run function.
 * @param {ContextConstructor[]} [options.context] Any context constructors for the test to be evaluated.
 * @param {number} [options.timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @param {function} options.fn The test function to run.
 */
async function run(options) {
  const { context, timeout = null, fn } = options
  const started = new Date()
  let error = null, result = null, destroyResult = null

  /** @type {Context[]} */
  let evaluatedContexts = []
  try {
    if (context) {
      const e = context ? _evaluateContexts(context) : Promise.resolve([])
      evaluatedContexts = await (timeout ? promto(e, timeout, 'Evaluate context') : e)
    }
    const r = fn(...evaluatedContexts)
    result = await (timeout ? promto(r, timeout, 'Test') : r)
  } catch (err) {
    error = err
  }

  // even if test failed, destroy context
  try {
    const destroy = destroyContexts(evaluatedContexts)
    destroyResult = await (timeout ? promto(destroy, timeout, 'Destroy') : destroy)
  } catch (err) {
    error = err
  }

  const finished = new Date()
  return {
    started, finished,
    error, result, destroyResult,
  }
}

module.exports=run


/**
 * @typedef {import('..').Run} Run Options for the run function.
 */