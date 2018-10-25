import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import Private from '../context/Private'

const C = { c1: 123, c2: 456, name: 'test' }
const CONTEXT = [Private, C, 'RES', Context]

/** @type {Object.<string, (api: Private, r0: C, r: 'RES-test', c: Context)>} */
const T = {
  context: CONTEXT,
  'is a function'({ run }) {
    equal(typeof run, 'function')
  },
  async 'runs a test function with contexts'({ run }, { c1, c2, name }) {
    const { result } = await run({
      /**
       * @param {c1} _c1
       * @param {c2} _c2
       */
      fn(_c1, _c2) {
        return `${_c1}-${name}-${_c2}`
      },
      context: [c1, c2],
    })
    equal(result, '123-test-456')
  },
  async 'fails test after specified timeout'({ run }) {
    const timeout = 100
    const fn = async () => {
      await new Promise(r => setTimeout(r, timeout + 100))
    }
    const { error: { message } } = await run({
      fn, timeout,
    })
    const msg = `Test has timed out after ${timeout}ms`
    equal(message, msg)
  },
  async 'runs a test'({ run }) {
    const { error, result, finished, started } = await run({
      fn() {},
    })
    equal(error, null)
    equal(result, null)
    ok(finished)
    ok(started)
  },
  async 'saves result of a test'({ run }, { name }) {
    const { result } = await run({
      fn() { return name },
    })
    equal(result, result)
  },
  async 'runs a test with an error'({ run }, { name }) {
    const { error, result } = await run({
      fn() { throw new Error(name) },
    })
    equal(result, null)
    ok(error)
    equal(error.message, name)
  },
  // async 'gets a link to the fixture'({ FIXTURE }) {
  //   const res = await reducer({
  //     text: FIXTURE,
  //   })
  //   ok(res, FIXTURE)
  // },
}

export default T