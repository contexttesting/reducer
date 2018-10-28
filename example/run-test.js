import reducer, { runTest } from '../src'

(async () => {
  const { test } = await reducer([
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
      async fn({ TEST }, { data }) {
        await new Promise(r => setTimeout(r, 100))
        return `${TEST}-${data}: ok`
      },
    },
  ], {
    runTest,
  })
  console.log(test)
})()