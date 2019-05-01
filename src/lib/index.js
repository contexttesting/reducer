/**
 * Evaluate a context or contexts in parallel.
 * @param {!Array<_contextTesting.ContextConstructor>} [contexts] The context constructors (class, function, object).
 */
export async function _evaluateContexts(contexts = []) {
  const c = Array.isArray(contexts) ? contexts : [contexts]
  const ep = c.map(evaluateContext)
  const res = await Promise.all(ep)
  return res
}

/**
 * @param {*} context The context to evaluate.
 */
export const evaluateContext = async (context) => {
  const fn = isFunction(context)
  if (!fn) return /** @type {_contextTesting.Context} */ (context)

  try {
    /** @type {_contextTesting.Context} */
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

    /** @type {_contextTesting.Context} */
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
 * @param {!Array<_contextTesting.Context>} contexts The contexts to destroy with _destroy method.
 */
export const destroyContexts = async (contexts) => {
  const dc = contexts.map(async (c) => {
    if (isFunction(c._destroy)) {
      const res = await c._destroy()
      return res
    }
  })
  const res = await Promise.all(dc)
  return res
}

export function isFunction(fn) {
  return (typeof fn).toLowerCase() == 'function'
}

/**
 * @typedef {import('@zoroaster/types').Context} _contextTesting.Context
 * @typedef {import('@zoroaster/types').ContextConstructor} _contextTesting.ContextConstructor
 */