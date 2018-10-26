import runTest from '../../src/lib/run-test'
import reducer from '../../src/lib/reducer'

export default class Private {
  get reducer() {
    return reducer
  }
  get runTest() {
    return runTest
  }
}