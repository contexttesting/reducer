import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import reducer from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await reducer({
      text: input,
    })
    return res
  },
  context: Context,
})

export default ts