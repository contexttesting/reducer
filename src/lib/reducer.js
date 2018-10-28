/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test and !test suite
 * @param {TestOrTestSuite[]} tests An array with tests to reduce.
 * @param {Config} config Options for the reducer.
 * @returns {Promise.<TestSuiteLite>}
 * @example
 *
 * // The test type
 * type Test = {
 *   context?: (new (...args: any[]) => Context)[];
 *   timeout?: number;
 *   name: number;
 *   isFocused?: boolean;
 *   isTest?: boolean;
 *   hasFocused?: boolean;
 *   fn: Function;
 * }
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
 * @typedef {import('../..').TestOrTestSuite} TestOrTestSuite
 * @typedef {import('../..').Config} Config Options for the reducer.
 * @typedef {import('../..').TestSuite} TestSuite The structure which will be passed to the `runTestSuite` method.
 * @typedef {import('../..').TestSuiteLite} TestSuiteLite The structure which will be passed to the `runTestSuite` method.
 */
