/**
 * Evaluate a context or contexts in parallel.
 * @param {ContextConstructor[]} [contexts=[]] The context constructors (class, function, object).
 */
       async function _evaluateContexts(contexts = []) {
  const c = Array.isArray(contexts) ? contexts : [contexts]
  const ep = c.map(evaluateContext)
  const res = await Promise.all(ep)
  return res
}

/**
 * @param {ContextConstructor|function} context The context to evaluate.
 * @return {Context}
 */
       const evaluateContext = async (context) => {
  const fn = isFunction(context)
  if (!fn) return context

  try {
    const c = {}
    await context.call(c)
    return c
  } catch (err) {
    if (!/^Class constructor/.test(err.message)) {
      throw err
    }
    // constructor context
    const c = new context()
    if (c._init) {
      await c._init()
    }

    const p = new Proxy(c, {
      get(target, key) {
        if (key == 'then') return target
        if (typeof target[key] == 'function') {
          return target[key].bind(target)
        }
        return target[key]
      },
    })

    return p
  }
}

/**
 * @param {Context[]} contexts The contexts to destroy with _destroy method
 * @return {*[]} The result of the destroy call on each context.
 */
       const destroyContexts = async (contexts) => {
  const dc = contexts.map(async (c) => {
    if (isFunction(c._destroy)) {
      const res = await c._destroy()
      return res
    }
  })
  const res = await Promise.all(dc)
  return res
}

       function isFunction(fn) {
  return (typeof fn).toLowerCase() == 'function'
}


/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */


module.exports._evaluateContexts = _evaluateContexts
module.exports.evaluateContext = evaluateContext
module.exports.destroyContexts = destroyContexts
module.exports.isFunction = isFunction