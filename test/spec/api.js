import { equal } from 'zoroaster/assert'
import * as api from '../../src'

const API = { ...api }

/** @type {Object.<string, (api: API)>} */
const TS = {
  context: API,
  'run is a function'({ run }) {
    equal(typeof run, 'function')
  },
  'reducer is a function'({ reducer }) {
    equal(typeof reducer, 'function')
  },
}

export default TS