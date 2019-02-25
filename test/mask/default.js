import { makeTestSuite, ok } from 'zoroaster'
import reducer, { runTest } from '../../src'

export default makeTestSuite('test/result/default.md', {
  async getResults(input) {
    let destroyed = false
    const timeout = this.timeout
    const res = await reducer([{
      context: [class C {
        async _init() {
          await new Promise(r => setTimeout(r, 170))
        }
        async _destroy() {
          destroyed = true
        }
      }],
      persistentContext: { t: 't' },
      timeout,
      name: input,
      fn({ t }) {
        return `${t}-${input}`
      },
    }], {
      runTest,
    })
    await new Promise(r => setTimeout(r, 50))
    ok(destroyed)
    return `${res[input].result}`
  },
  jsonProps: ['timeout'],
})