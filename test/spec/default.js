import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import _run from '../../src/lib/run'

const C = { run: _run, c1: 123, c2: 456 }
const CONTEXT = [C, 'RES-test', Context]

/** @type {Object.<string, (r0: C, r: 'RES-test', c: Context)>} */
const T = {
  context: CONTEXT,
  'is a function'({ run }) {
    equal(typeof run, 'function')
  },
  async 'calls package without error'({ run, c1, c2 }, RES) {
    debugger
    const { result } = await run({
      /**
       * @param {c1} _c1
       * @param {c2} _c2
       */
      fn(_c1, _c2) {
        return `${_c1}-${RES}-${_c2}`
      },
      context: [c1, c2],
    })
    equal(result, '123-RES-test-456')
  },
  // async 'gets a link to the fixture'({ FIXTURE }) {
  //   const res = await reducer({
  //     text: FIXTURE,
  //   })
  //   ok(res, FIXTURE)
  // },
}

export default T