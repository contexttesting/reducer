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

export default reducer

/* documentary types/context.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 *
 * @typedef {{new(...args: any[]): Context}} ContextConstructor A function or class or object that makes a context
 */

/* documentary types/test.xml */
/**
 * @typedef {Object} Test The test type as used by the reducer.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {number} name The name of the test.
 * @prop {boolean} [isFocused=false] If the test is focused. Default `false`.
 * @prop {boolean} [isTest=true] If it is a test and not a test suite. Default `true`.
 * @prop {boolean} [isSelfFocused] The property of the test suite such that it is focused.
 * @prop {boolean} [hasFocused] Whether the test suite has focused tests.
 * @prop {function} fn The test function to run.
 */
