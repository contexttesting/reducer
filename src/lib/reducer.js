process.env.ALAMODE_ENV == 'test-build' && console.log('> test %s', require('path').relative('', __filename))
import runTest from './run-test'

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
const reducer = async (tests = {}, config = {}) => {
  const {
    onlyFocused = false,
    // notify,
  } = config
  const newState = await Object.keys(tests).reduce(async (acc, key) => {
    const val = tests[key]
    const {
      context, name, timeout,
      // test:
      isTest = true, isFocused, fn,
      // ts:
      isSelfFocused, hasFocused, tests: ts,
    } = val
    const accRes = await acc
    let res
    const t = { name, context, fn, timeout }
    const run = isTest
      ? runTest.bind(null, t)
      : reducer.bind(null, ts, { onlyFocused: hasFocused })

    if (!onlyFocused || isFocused) {
      res = await run()
    } else if (isSelfFocused || hasFocused) { // test suite
      res = await run()
    }
    if (res) accRes[key] = res
    return accRes
  }, {})

  return newState
}

export default reducer

/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 * @typedef {import('../../types').Test} Test
 * @typedef {import('../../types').Config} Config
 */
