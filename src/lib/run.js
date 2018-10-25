import promto from 'promto'
import { _evaluateContexts, destroyContexts } from '.'

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

export default run

/* documentary types/run.xml */
/**
 * @typedef {Object} Run Options for the run function.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {function} fn The test function to run.
 */

/* documentary types/context.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 *
 * @typedef {{new(...args: any[]): Context}} ContextConstructor A function or class or object that makes a context
 */
