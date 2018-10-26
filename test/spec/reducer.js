import { deepEqual } from 'zoroaster/assert'
import * as C from '../context'
import Private from '../context/Private'

const CONTEXT = [Private, { ...C }]

/** @type {Object.<string, (api: Private, r0: C)>} */
const T = {
  context: CONTEXT,
  async 'reduces a single test'({ reducer }, { assertDates, deleteDates, test }) {
    const res = await reducer({ test })
    const vals = Object.values(res)
    assertDates(vals)
    const sd = deleteDates(vals)
    deepEqual(sd, [{
      result: undefined,
      error: null,
      destroyResult: [],
    }])
  },
  async 'reduces 2 tests'({ reducer }, { assertDates, deleteDates, test }) {
    const res = await reducer({ test, test2: test })
    const vals = Object.values(res)
    assertDates(vals)
    const sd = deleteDates(vals)
    deepEqual(sd, [{
      result: undefined,
      error: null,
      destroyResult: [],
    }, {
      result: undefined,
      error: null,
      destroyResult: [],
    }])
  },
  async 'reduces focussed test'({ reducer }, { deleteDates, makeFocused, test }) {
    const F = 'focused'
    const t = makeFocused(test, () => F)
    const res = await reducer({ t, test, test2: test }, {
      onlyFocused: true,
    })
    const sd = deleteDates(Object.values(res))
    deepEqual(sd, [{
      result: F,
      error: null,
      destroyResult: [],
    }])
  },
}

// export { T }

/** @type {Object.<string, (api: Private, r0: C)>} */
const TestSuite = {
  context: CONTEXT,
  async 'reduces test suite'({ reducer }, { test, deleteDates }) {
    const ts = { tests: { test }, isTest: false }
    const tests = { ts }
    const res = await reducer(tests, {
      onlyFocused: false,
    })
    const [t] = deleteDates([res.ts.test])
    res.ts.test = t
    deepEqual(res, {
      ts: {
        test: {
          result: undefined,
          error: null,
          destroyResult: [],
        },
      },
    })
  },
}

export { TestSuite }

export default T