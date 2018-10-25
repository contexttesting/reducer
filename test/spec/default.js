import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import reducer from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof reducer, 'function')
  },
  async 'calls package without error'() {
    await reducer()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await reducer({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T