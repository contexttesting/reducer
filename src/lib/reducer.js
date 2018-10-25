import runTest from './run'
import { dumpResult } from '.'

/**
 * Run the test.
 * @param {{ name: string, context: ContextConstructor, fn: function, timeout?: number }} param1
 * @param {function} notify - notify function
 */
async function run({
  name, context, fn, timeout,
}, notify = NOTIFY) {
  notify({
    name,
    type: 'test-start',
  })
  const res = await runTest({
    context,
    fn,
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
 */
const reducer = async (tests, config) => {
  const {
    onlyFocused = false,
    notify = NOTIFY,
  } = config
  const newState = await tests.reduce(async (acc, {
    context, fn, name, timeout, isFocused,
    // test:
    isTest,
    // ts:
    isSelfFocused, hasFocused,
  }) => {
    const accRes = await acc
    let res
    const t = { context, fn, name, timeout, isFocused }
    if (!onlyFocused) {
      res = await run(t, notify)
    } else if (isTest && isFocused) {
      res = await run(t, notify)
    // a test suite
    } else if (isSelfFocused) {
      res = await run(notify, hasFocused)
    } else if (hasFocused) {
      res = await run(notify, true)
    }
    return [...accRes, res]
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

/* documentary types/reducer.xml */
/**
 * @typedef {Object} Config Options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {function} notify The notify function to be passed to run method.
 * @prop {Test} Test The constructor of the Test class.
 */
