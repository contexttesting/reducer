process.env.ALAMODE_ENV == 'test-build' && console.log('> test %s', require('path').relative('', __filename))
import { EOL } from 'os'
import cleanStack from '@artdeco/clean-stack'

export function indent(str, padding) {
  return str.replace(/^(?!\s*$)/mg, padding)
}
/**
 * Evaluate a context or contexts in parallel.
 * @param {ContextConstructor[]} [contexts=[]] The context constructors (class, function, object).
 */
export async function _evaluateContexts(contexts = []) {
  const c = Array.isArray(contexts) ? contexts : [contexts]
  const ep = c.map(evaluateContext)
  const res = await Promise.all(ep)
  return res
}

/**
 * @param {ContextConstructor|function} context The context to evaluate.
 * @return {Context}
 */
export const evaluateContext = async (context) => {
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


/* documentary types/context.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 *
 * @typedef {{new(...args: any[]): Context}} ContextConstructor A function or class or object that makes a context
 */


export function dumpResult({ error, name }) {
  if (error === null) {
    return `${TICK} ${name}`
  } else {
    return `${CROSS} ${name}` + EOL
      + indent(filterStack({ error, name }), ' | ')
  }
}

export function getPadding(level) {
  return Array
    .from({ length: level * 2 })
    .join(' ')
}

/**
 * Get clean stack for a test, without Node internals
 * @param {Test} test - test
 */
export function filterStack({ error, name }) {
  if (!error) {
    throw new Error('cannot filter stack when a test does not have an error')
  }
  const splitStack = error.stack.split('\n') // break stack by \n and not EOL intentionally because Node uses \n
  // node 4 will print: at test_suite.test2
  // node 6 will print: at test2
  const regex = new RegExp(`at (.+\\.)?${name}`)
  const resIndex = splitStack.findIndex(element => regex.test(element)) + 1
  const joinedStack = splitStack.slice(0, resIndex).join('\n')
  const stack = joinedStack ? joinedStack : cleanStack(error.stack) // use clean stack for async errors
  return stack.replace(/\n/g, EOL)
}


const TICK = '\x1b[32m \u2713 \x1b[0m'
const CROSS = '\x1b[31m \u2717 \x1b[0m'

