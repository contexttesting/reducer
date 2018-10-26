import { deepEqual } from 'zoroaster/assert'
import * as C from '../context'
import Private from '../context/Private'

const CONTEXT = [Private, { ...C }]

/** @type {Object.<string, (api: Private, r0: C)>} */
const T = {
  context: CONTEXT,
  async 'reduces a single test'({ reducer }, { assertDates, deleteDates, test }) {
    const res = await reducer([ test ])
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
    const res = await reducer([ test, { ...test, name: 'test2' } ])
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
    const res = await reducer([ t, test, { ...test, name: 'test2' } ], {
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

/** @type {Object.<string, (api: Private, r0: C)>} */
const TestSuite = {
  context: CONTEXT,
  async 'reduces test suite'({ reducer }, { test }) {
    const ts = [{ tests: [ test ], isTest: false, name: 'test-suite' }]
    const res = await reducer(ts, {
      onlyFocused: false,
    })
    Object.values(res['test-suite']).forEach(v => {
      delete v.started
      delete v.finished
    })
    deepEqual(res, {
      'test-suite': {
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