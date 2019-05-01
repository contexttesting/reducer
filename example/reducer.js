import reducer, { runTest } from '../src'

const runInSequence = async (testSuite, level = 0) => {
  const indent = '  '.repeat(level)
  return await reducer(testSuite, {
    async runTest(test) {
      let result
      try {
        result = await runTest(test)
      } catch (error) {
        console.log('%s[x] %s: %s', indent, test.name, error.message)
        return { error: error.message }
      }
      console.log('%s[+] %s%s', indent, test.name, result ? `: ${result}` : '')
      return { result }
    },
    async runTestSuite(ts) {
      console.log('%s %s', indent, ts.name)
      return await runInSequence(ts.tests, level + 1)
    },
  })
}

(async () => {
  const tree = await runInSequence([
    {
      name: 'test',
      fn() { return 'ok' },
    },
    {
      name: 'test with context',
      context: class Context {
        async _init() {
          await new Promise(r => setTimeout(r, 10))
          this.hello = 'world'
        }
      },
      fn({ hello }) { return `ok - ${hello}` },
    },
    {
      name: 'test-suite',
      tests: [
        {
          name: 'test1',
          fn() { throw new Error('fail') },
        },
      ],
    },
  ])
  console.error(tree)
})()