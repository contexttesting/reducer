import { resolve } from 'path'
import { debuglog } from 'util'
import { ok } from 'zoroaster/assert'

const LOG = debuglog('@zoroaster/reducer')

const FIXTURE = resolve(__dirname, '../fixture')

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    LOG('init context')
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  async _destroy() {
    LOG('destroy context')
  }
}

/**
 * A test name.
 */
export const NAME = 'test'
/**
 * A constant 2.
 */
export const c2 = 456
/**
 * A constant.
 */
export const c1 = 123

/**
 * @type {Test}
 */
const _test = {
  fn() {},
  name: NAME,
}

export { _test as test }

export function runTest({ fn }) {
  const result = fn()
  return { result }
}

export const makeFocused = (test, fn) => {
  const t = {
    ...test,
    isFocused: true,
    name: `!${test.name}`,
    fn,
  }
  return t
}

export const assertDates = d => d.forEach(({ started, finished }) => {
  ok(started instanceof Date)
  ok(finished instanceof Date)
})

export const deleteDates = d => d.map(({ started, finished, ...rest }) => { // eslint-disable-line
  return rest
})


/* documentary types/test.xml */
/**
 * @typedef {Object} Test The test type as used by the reducer.
 * @prop {number} name The name of the test.
 * @prop {function} fn The test function to run.
 * @prop {ContextConstructor[]} [context] Any context constructors for the test to be evaluated.
 * @prop {number} [timeout=null] The timeout for the test, context evaluation and destruction. Default `null`.
 * @prop {boolean} [isFocused=false] If the test is focused. Default `false`.
 * @prop {boolean} [isSelfFocused] The property of the test suite such that it is focused.
 * @prop {boolean} [hasFocused] Whether the test suite has focused tests.
 */

