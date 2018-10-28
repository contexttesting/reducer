import reducer from '../src'

(async () => {
  const { test, test1 } = await reducer([
    {
      name: 'test',
      fn() { return 'ok' },
    },
    {
      name: 'test1',
      fn() { throw new Error('fail') },
    },
  ], {
    runTest({ fn, name }) {
      let result
      try {
        result = fn()
      } catch (error) {
        console.log('[x] %s: %s', name, error.message)
        return { error: error.message }
      }
      console.log('[+] %s%s', name, result ? `: ${result}` : '')
      return { result }
    },
  })
  console.log(test)
  console.log(test1)
})()