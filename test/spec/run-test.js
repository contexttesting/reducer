import { equal, ok } from 'zoroaster/assert'
import * as C from '../context'
import Private from '../context/Private'

const CONTEXT = [Private, { ...C }]

/** @type {Object.<string, (api: Private, r0: C)>} */
const T = {
  context: CONTEXT,
  async 'runs a test function with contexts'({ runTest }, { c1, c2, NAME }) {
    const { result } = await runTest({
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
  async 'fails test after specified timeout'({ runTest }) {
    const timeout = 100
    const fn = async () => {
      await new Promise(r => setTimeout(r, timeout + 100))
    }
    const { error: { message } } = await runTest({
      fn, timeout,
    })
    const msg = `Test has timed out after ${timeout}ms`
    equal(message, msg)
  },
  async 'runs a test'({ runTest }, { test }) {
    const { error, result, finished, started } = await runTest(test)
    ok(error === null)
    ok(result === undefined)
    ok(finished)
    ok(started)
  },
  async 'saves result of a test'({ runTest }, { test }) {
    const F = 'F'
    const { result } = await runTest({ ...test, fn: () => F })
    equal(result, F)
  },
  async 'runs a test with an error'({ runTest }, { test }) {
    const E = new Error('Test')
    const { result, error } = await runTest({ ...test, fn: () => { throw E } })
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