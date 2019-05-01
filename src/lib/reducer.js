/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test and !test suite
 * @param {!Array<!(_contextTesting.Test|_contextTesting.TestSuite)>} tests An array with tests to reduce.
 * @param {_contextTesting.ReducerConfig} config The options for the reducer.
 * @param {boolean} [config.onlyFocused=false] Run only focused tests. Default `false`.
 * @param {function(_contextTesting.Test): !Promise} config.runTest The function that wraps around `@zoroaster/reducer.runTest` method.
 * @param {function(_contextTesting.TestSuite, boolean): !Promise<!_contextTesting.TestSuite>} config.runTestSuite The function used to run a test suite. The second argument receives whether the test suite has focused.
 * @example
```ts
type TestOrTestSuite = {
  context?: function(new: Context)
  timeout?: number;
  name: number;
  isFocused?: boolean;
  hasFocused?: boolean;
  fn: Function;
}
```
 */
const reducer = async (tests = [], config) => {
  const {
    onlyFocused = false,
    allCanRun = !onlyFocused,
    runTest,
    runTestSuite,
  } = config
  const newState = await tests.reduce(async (acc, test) => {
    const {
      name, isFocused, fn, isTest = !!fn,
      // ts
      hasFocused,
    } = test
    if (allCanRun || isFocused || hasFocused) {
      const accRes = acc instanceof Promise ? await acc : acc // :o
      let res
      const exec = isTest
        ? () => runTest(test)
        : () => runTestSuite(test, hasFocused)
      res = await exec()
      if (isTest) {
        Object.assign(test, res)
        accRes[name] = test
      } else {
        accRes[name] = res
      }
      return accRes
    } else {
      return acc
    }
  }, {})

  return newState
}

export default reducer

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/types').Test} _contextTesting.Test
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/types').TestSuite} _contextTesting.TestSuite
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').ReducerConfig} _contextTesting.ReducerConfig
 */