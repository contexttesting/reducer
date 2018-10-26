import { equal, ok } from 'zoroaster/assert'
import * as C from '../context'
import Private from '../context/Private'

const CONTEXT = [Private, { ...C }]

/** @type {Object.<string, (api: Private, r0: C)>} */
const T = {
  context: CONTEXT,
  'is a function'({ run }) {
    equal(typeof run, 'function')
  },
  async 'runs a test function with contexts'({ run }, { c1, c2, NAME }) {
    const { result } = await run({
      /**
       * @param {c1} _c1
       * @param {c2} _c2
       */
      fn(_c1, _c2) {
        return `${_c1}-${NAME}-${_c2}`
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
  async 'runs a test'({ run }, { test }) {
    const { error, result, finished, started } = await run(test)
    ok(error === null)
    ok(result === undefined)
    ok(finished)
    ok(started)
  },
  async 'saves result of a test'({ run }, { test }) {
    const F = 'F'
    const { result } = await run({ ...test, fn: () => F })
    equal(result, F)
  },
  async 'runs a test with an error'({ run }, { test }) {
    const E = new Error('Test')
    const { result, error } = await run({ ...test, fn: () => { throw E } })
    equal(result, null)
    equal(error, E)
  },
  // async 'gets a link to the fixture'({ FIXTURE }) {
  //   const res = await reducer({
  //     text: FIXTURE,
  //   })
  //   ok(res, FIXTURE)
  // },
}

export default T