process.env.ALAMODE_ENV == 'test-build' && console.log('> test %s', require('path').relative('', __filename))
const runTest = require('./run-test');

/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test
 * @param {Test[]} tests An array with tests to reduce
 * @param {Config} config Options for the reducer.
 * @param {boolean} [config.onlyFocused=false] Run only focused tests. Default `false`.
 * @param {function} config.notify The notify function to be passed to run method.
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
const reducer = async (tests, config = {}) => {
  const {
    onlyFocused = false,
    notify,
  } = config
  const newState = await tests.reduce(async (acc, {
    context, name, timeout,
    // test:
    isTest = true, isFocused, fn,
    // ts:
    isSelfFocused, hasFocused,
  }) => {
    const accRes = await acc
    let res
    const t = { name, context, fn, timeout }
    if (!onlyFocused) {
      res = await runTest(t, notify)
    } else if (isTest && isFocused) {
      res = await runTest(t, notify)
    // a test suite (not tested)
    } else if (isSelfFocused) {
      console.warn('not implemented')
      return acc
      // res = await _testSuiteRun(notify, hasFocused)
    } else if (hasFocused) {
      console.warn('not implemented')
      return acc
      // res = await _testSuiteRun(notify, true)
    }
    return res ? [...accRes, res] : accRes
  }, [])

  return newState
}

module.exports=reducer

/**
 * @typedef {import('..').Context} Context
 * @typedef {import('..').ContextConstructor} ContextConstructor
 * @typedef {import('..').Test} Test
 */