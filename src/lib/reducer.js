process.env.ALAMODE_ENV == 'test-build' && console.log('> test %s', require('path').relative('', __filename))

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
const reducer = async (tests = [], config = {}) => {
  const {
    onlyFocused = false,
    notify,
  } = config
  const newState = await tests.reduce(async (acc, test) => {
    const {
      name,
      isFocused, fn,
      isSelfFocused, hasFocused, tests: ts,
    } = test
    const accRes = await acc
    let res
    const isTest = !!fn
    const run = isTest
      ? test.fn.bind(test, notify) // the test will have a run method
      : reducer.bind(null, ts, { onlyFocused: hasFocused })

    if (!onlyFocused || isFocused || hasFocused || isSelfFocused) {
      res = await run()
    }

    if (res) accRes[name] = res
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
