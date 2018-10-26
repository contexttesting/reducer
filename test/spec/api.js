import { equal } from 'zoroaster/assert'
import * as api from '../../src' // THIS IS A BUG IT'S NOT TESTING THE API

const API = { ...api }

/** @type {Object.<string, (api: API)>} */
const TS = {
  context: API,
  'reducer is a function'({ reducer }) {
    equal(typeof reducer, 'function')
  },
  'runTest is a function'({ runTest }) {
    equal(typeof runTest, 'function')
  },
}

export default TS