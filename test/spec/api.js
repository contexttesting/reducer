import { equal } from 'zoroaster/assert'
// IT'S NOT TESTING THE BUILD API
import reducer, { runTest } from '../../src'

/** @type {Object.<string, (api: API)>} */
const TS = {
  'reducer is a function'() {
    equal(typeof reducer, 'function')
  },
  'runTest is a function'() {
    equal(typeof runTest, 'function')
  },
}

export default TS