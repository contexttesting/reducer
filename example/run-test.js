import reducer, { runTest } from '../src'
import { Readable } from 'stream'

(async () => {
  const persistentContext = await Promise.resolve('EXAMPLE')
  const tree = await reducer([
    {
      name: 'test',
      context: [
        { TEST: 'hello' },
        class Context {
          async _init() {
            this.data = 'world'
            this._started = new Date()
          }
          async _destroy() {
            const dt = new Date().getTime() - this._started.getTime()
            return `${dt}ms`
          }
        },
      ],
      persistentContext,
      async fn(pc, { TEST }, { data }) {
        await new Promise(r => setTimeout(r, 100))
        return `[${pc}] ${TEST}-${data}: ok`
      },
    },
    {
      name: 'test with stream',
      fn() {
        return new Readable({
          read() {
            this.push('data')
            this.push(null)
          },
        })
      },
    },
  ], {
    runTest,
  })
  console.log(tree)
})()