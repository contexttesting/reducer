import { deepEqual } from 'zoroaster/assert'
import * as C from '../context'
import Private from '../context/Private'

const CONTEXT = [Private, { ...C }]

/** @type {Object.<string, (api: Private, r0: C)>} */
const T = {
  context: CONTEXT,
  async 'reduces a single test'({ reducer }, { assertDates, deleteDates, test }) {
    const res = await reducer([test])
    assertDates(res)
    const sd = deleteDates(res)
    deepEqual(sd, [{
      result: undefined,
      error: null,
      destroyResult: [],
    }])
  },
  async 'reduces 2 tests'({ reducer }, { assertDates, deleteDates, test }) {
    const res = await reducer([test, test])
    assertDates(res)
    const sd = deleteDates(res)
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
    const res = await reducer([t, test, test], {
      onlyFocused: true,
    })
    const sd = deleteDates(res)
    deepEqual(sd, [{
      result: F,
      error: null,
      destroyResult: [],
    }])
  },
}

export default T