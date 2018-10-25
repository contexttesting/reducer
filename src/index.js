const NOTIFY = () => {}
const run = async (notify = NOTIFY, hasFocused) => {
  notify('ok')
}

/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test
 * @param {Test[]} tests An array with tests to reduce
 * @param {Config} config Options for the reducer.
 * @param {boolean} [config.onlyFocused=false] Run only focused tests. Default `false`.
 * @param {function} config.notify The notify function to be passed to run method.
 * @param {Test} config.Test The constructor of the Test class.
 */
const reducer = async (tests, config) => {
  const {
    onlyFocused = false,
    notify = NOTIFY,
    Test,
  } = config
  const newState = await tests.reduce(async (acc, test) => {
    const accRes = await acc
    let res
    if (!onlyFocused) {
      res = await run(notify)
    } else if (test instanceof Test && test.isFocused) {
      res = await run(notify)
    // a test suite
    } else if (test.isSelfFocused) {
      res = await run(notify, test.hasFocused)
    } else if (test.hasFocused) {
      res = await run(notify, true)
    }
    return [...accRes, res]
  }, [])

  return newState
}

export default reducer

/* documentary types/reducer.xml */
/**
 * @typedef {Object} Config Options for the reducer.
 * @prop {boolean} [onlyFocused=false] Run only focused tests. Default `false`.
 * @prop {function} notify The notify function to be passed to run method.
 * @prop {Test} Test The constructor of the Test class.
 */
