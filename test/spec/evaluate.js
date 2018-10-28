import { deepEqual, throws } from 'zoroaster/assert'
import { evaluateContext } from '../../src/lib'

const T = {
  context: {
    name: 'Zarathustra',
    country: 'Iran',
    born: -628,
    died: -551,
  },
  async 'keeps the object context as is'(ctx) {
    const c = await evaluateContext(ctx)
    deepEqual(c, ctx)
  },
  async 'evaluates async context'(ctx) {
    async function c() {
      await new Promise(r => process.nextTick(r))
      Object.assign(this, ctx)
    }
    const context = await evaluateContext(c)
    deepEqual(context, ctx)
  },
  async 'evaluates context'(ctx) {
    function c() {
      Object.assign(this, ctx)
    }
    const context = await evaluateContext(c)
    deepEqual(context, ctx)
  },
}

/** @type {Object.<string, (c: Context)>} */
export const fails = {
  async 'if evaluation failed'() {
    const error = new Error('test-init-context-error')
    function c() {
      throw error
    }
    await throws({
      fn: evaluateContext,
      args: c,
      error,
    })
  },
  async 'if async evaluation failed'() {
    const error = new Error('test-init-context-error')
    async function c() {
      await new Promise(r => process.nextTick(r))
      throw error
    }
    await throws({
      fn: evaluateContext,
      args: c,
      error,
    })
  },
  async 'if async class init failed'() {
    const error = new Error('test-init-context-error')
    class C {
      async _init() {
        throw error
      }
    }
    await throws({
      fn: evaluateContext,
      args: C,
      error,
    })
  },
  async 'if class init failed'() {
    const error = new Error('test-init-context-error')
    class C {
      _init() {
        throw error
      }
    }
    await throws({
      fn: evaluateContext,
      args: C,
      error,
    })
  },
}

export default T