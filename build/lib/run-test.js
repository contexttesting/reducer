let promto = require('promto'); if (promto && promto.__esModule) promto = promto.default;
const { _evaluateContexts, destroyContexts } = require('.');

/**
 * Asynchronously runs the test within a timeout limit. Evaluates the contexts beforehand and destroys them after.
 * @param {Test} test The test to run.
 */
const runTest = async (test) => {
  const { context, timeout = null, fn, persistentContext } = test
  const started = new Date()
  /** @type {Error|null} */
  let error = null
  let result = null, destroyResult = null

  /** @type {Context[]} */
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
 * @typedef {import('..').Test} Test
 */