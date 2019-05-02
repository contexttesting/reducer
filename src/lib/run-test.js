import Catchment from 'catchment'
import Stream from 'stream'
import promto from 'promto'
import { _evaluateContexts, destroyContexts } from './'

/**
 * Asynchronously runs the test within a timeout limit. Evaluates the contexts beforehand and destroys them after.
 * @param {_contextTesting.RunTestOptions} options Options for the `runTest` method.
 * @param {!Array<*>} [options.context] The contexts to evaluate.
 * @param {!Function} options.fn The function to execute.
 * @param {!Array<*>} [options.persistentContext] Evaluated persistent contexts that will come before other contexts.
 * @param {?number} [options.timeout="null"] The timeout to run the test and evaluate/destroy contexts within. Default `null`.
 * @param {function(!stream.Writable)} [options.onCatchment] The callback that will be called with the _Catchment_ stream if the test returned a stream. The stream's data will be collected into the catchment to create the result as a string. The callback can be used to emit errors on the _Catchment_ stream.
 */
const runTest = async (options) => {
  const {
    context, timeout = null, fn, persistentContext, onCatchment,
  } = options
  const started = new Date()
  /** @type {Error} */
  let error = null
  let result = null, destroyResult = null

  /** @type {!Array<!_contextTesting.Context>} */
  let evaluatedContexts = []
  let e
  let eEvaluated
  try {
    if (context) {
      e = context ? _evaluateContexts(context) : Promise.resolve([])
      e.then(() => {
        eEvaluated = true
      })
      evaluatedContexts = await (timeout ? promto(e, timeout, 'Evaluate context') : e)
    }
    const c = persistentContext ? [
      ...(Array.isArray(persistentContext) ? persistentContext : [persistentContext]),
      ...evaluatedContexts,
    ] : evaluatedContexts
    const r = fn(...c)
    if (r instanceof Promise) {
      result = await (timeout ? promto(r, timeout, 'Test') : r)
    } else {
      result = r
    }
  } catch (err) {
    error = err
  }

  if (result instanceof Stream) {
    try {
      const catchment = new Catchment({ rs: result })
      if (onCatchment) onCatchment(catchment)
      result = await catchment.promise
    } catch (err) {
      error = err
    }
  }

  // even if test failed, destroy context
  try {
    const destroy = destroyContexts(evaluatedContexts)
    destroyResult = await (timeout ? promto(destroy, timeout, 'Destroy') : destroy)
  } catch (err) {
    error = err
  }
  if (!eEvaluated && e) awaitEvaluations(e)

  const finished = new Date()
  return {
    started, finished,
    error, result, destroyResult,
  }
}

const awaitEvaluations = async (e) => {
  const ee = await e
  await destroyContexts(ee)
}

export default runTest

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').RunTestOptions} _contextTesting.RunTestOptions
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Writable} stream.Writable
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/types').Context} _contextTesting.Context
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/types').ContextConstructor} _contextTesting.ContextConstructor
 */