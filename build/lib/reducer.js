/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test and !test suite
 * @param {Test[]} tests An array with tests to reduce.
 * @param {Config} [config] Options for the reducer.
 * @param {boolean} [config.onlyFocused=false] Run only focused tests. Default `false`.
 * @param {(test: Test) => Promise.<*>} config.runTest The function used to run a test. It will receive `name`, `context`, `fn`, and `timeout` properties.
 * @param {(testSuite: TestSuiteConfig) => Promise.<*>} config.runTestSuite The function used to run a test suite. It will receive `name`, `tests` and `onlyFocused` properties.
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
const reducer = async (tests = [], config = {}) => {
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

module.exports=reducer

/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 * @typedef {import('../../types').Test} Test
 */

/* documentary types/reducer.xml */
/**
 * @typedef {Object} TestSuiteConfig
 * @prop {string} name The name of the test suite.
 * @prop {Test[]} tests Tests.
 * @prop {boolean} onlyFocused Run only focused tests.
 *
 * @typedef {Object} Config Options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {(test: Test) => Promise.<*>} runTest The function used to run a test. It will receive `name`, `context`, `fn`, and `timeout` properties.
 * @prop {(testSuite: TestSuiteConfig) => Promise.<*>} runTestSuite The function used to run a test suite. It will receive `name`, `tests` and `onlyFocused` properties.
 */
