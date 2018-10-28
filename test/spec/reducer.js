import { deepEqual } from 'zoroaster/assert'
import * as C from '../context'
import Private from '../context/Private'

const CONTEXT = [Private, { ...C }]

/** @type {Object.<string, (api: Private, r0: C)>} */
const T = {
  context: CONTEXT,
  async 'reduces a single test'({ reducer }, { test, runTest }) {
    const res = await reducer([test], {
      runTest,
    })
    deepEqual(res, { test })
  },
  async 'reduces 2 tests'({ reducer }, { test }) {
    const test2 = { ...test, name: 'test2' }
    const res = await reducer([test, test2], {
      runTest({ fn }) {
        return fn()
      },
    })
    deepEqual(res, { test, test2 })
  },
  async 'reduces focussed test'({ reducer }, { makeFocused, test, runTest }) {
    const F = 'focused'
    const t = makeFocused(test, () => F)
    const res = await reducer([t, test, { ...test, name: 'test2' }], {
      onlyFocused: true,
      runTest,
    })
    deepEqual(res, { [t.name]: { ...t, result: F } })
  },
}

/** @type {Object.<string, (api: Private, r0: C)>} */
const TestSuite = {
  context: CONTEXT,
  async 'reduces test suite'({ reducer }, { test, runTest }) {
    const ts = [{ tests: [test], name: 'test-suite' }]
    function runTestSuite({ tests, onlyFocused }) {
      return reducer(tests, {
        onlyFocused, runTest, runTestSuite,
      })
    }
    const res = await reducer(ts, {
      onlyFocused: false,
      runTest,
      runTestSuite,
    })
    deepEqual(res, {
      'test-suite': {
        test,
      },
    })
  },
}

export { TestSuite }

export default T