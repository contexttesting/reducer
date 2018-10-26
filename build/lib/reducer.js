process.env.ALAMODE_ENV == 'test-build' && console.log('> test %s', require('path').relative('', __filename))
const runTest = require('./run');
const { dumpResult } = require('.');

/**
 * Run the test (wrapped around notify)
 * @param {{ name: string, context: ContextConstructor, fn: function, timeout?: number }} param1
 * @param {function} notify - notify function
 */
async function _run({
  name, context, fn, timeout,
}, notify = NOTIFY) {
  notify({
    name,
    type: 'test-start',
  })
  const res = await runTest({
    fn,
    context,
    timeout,
  })
  const { error } = res
  notify({
    // test,
    name,
    error,
    type: 'test-end',
    result: dumpResult({ error, name }),
  })
  return res
}

const NOTIFY = () => {}

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
    notify = NOTIFY,
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
      res = await _run(t, notify)
    } else if (isTest && isFocused) {
      res = await _run(t, notify)
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

/* documentary types/context.xml */
/**
 * @typedef {import('..').Context} Context A context made with a constructor.
 * @typedef {import('..').Config} Config Options for the reducer.
 * @typedef {import('..').Test} Test The test.
 * @typedef {import('..').ContextConstructor} ContextConstructor A function or class or object that makes a context
 */