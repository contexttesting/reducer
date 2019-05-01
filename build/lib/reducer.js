/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test and !test suite
 * @param {!Array<_contextTesting.TestOrTestSuite>} tests An array with tests to reduce.
 * @param {_contextTesting.ReducerConfig} config The options for the reducer.
 * @param {boolean} [config.onlyFocused=false] Run only focused tests. Default `false`.
 * @param {function({ fn: !Function }): !Promise} config.runTest The function used to run a test.
 * @param {function(!Object, boolean): !Promise<!TestSuite>} config.runTestSuite The function used to run a test suite.
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

module.exports=reducer

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').TestOrTestSuite} _contextTesting.TestOrTestSuite
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').ReducerConfig} _contextTesting.ReducerConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').TestSuite} _contextTesting.TestSuite
 */
