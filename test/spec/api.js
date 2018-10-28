import { equal } from 'zoroaster/assert'
import reducer, * as api from '../../src' // IT'S NOT TESTING THE BUILD API

const API = { ...api }

/** @type {Object.<string, (api: API)>} */
const TS = {
  context: API,
  'reducer is a function'() {
    equal(typeof reducer, 'function')
  },
  'runTest is a function'({ runTest }) {
    equal(typeof runTest, 'function')
  },
}

export default TS