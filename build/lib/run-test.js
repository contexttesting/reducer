let promto = require('promto'); if (promto && promto.__esModule) promto = promto.default;
const { _evaluateContexts, destroyContexts } = require('.');

/**
 * Asynchronously runs the test within a timeout limit. Evaluates the contexts beforehand and destroys them after.
 * @param {_contextTesting.Test} test The test structure used in `runTest`.
 * @param {!Function} test.fn The test function to run.
 * @param {!Array<_contextTesting.ContextConstructor>} [test.context] Any context constructors for the test to be evaluated.
 * @param {!Array<_contextTesting.Context>} [test.persistentContext] Any evaluated context constructors for the test that are managed by the test suite.
 * @param {?number} [test.timeout="null"] The timeout for the test, context evaluation and destruction. Default `null`.
 */
const runTest = async (test) => {
  const { context, timeout = null, fn, persistentContext } = test
  const started = new Date()
  /** @type {Error} */
  let error = null
  let result = null, destroyResult = null

  /** @type {!Array<_contextTesting.Context>} */
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

module.exports=runTest


/**
 * @typedef {import('../../types').Test} _contextTesting.Test
 */

/**
 * @typedef {import('@zoroaster/types').Context} _contextTesting.Context
 * @typedef {import('@zoroaster/types').ContextConstructor} _contextTesting.ContextConstructor
 */