/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test and !test suite
 * @param {Test[]} tests An array with tests to reduce.
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
 *   isSelfFocused?: boolean;
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
      name, isFocused, fn, context, timeout,
      // run, // a test or test suite can implement run on top of fn
      isSelfFocused, hasFocused, tests: ts,
    } = test
    if (allCanRun || isFocused || hasFocused || isSelfFocused) {
      const accRes = acc instanceof Promise ? await acc : acc
      let res
      const isTest = !!fn
      const exec = isTest
        ? () => runTest({ name, context, fn, timeout })
        : () => runTestSuite({ name, tests: ts, onlyFocused: hasFocused })
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
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 * @typedef {import('../../types').Test} Test
 * @typedef {import('../..').Config} Config Options for the reducer.
 * @typedef {import('../..').TestSuite} TestSuite The structure which will be passed to the `runTestSuite` method.
 * @typedef {import('../..').TestSuiteLite} TestSuiteLite The structure which will be passed to the `runTestSuite` method.
 */
