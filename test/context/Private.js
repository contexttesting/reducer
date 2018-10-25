import run from '../../src/lib/run'
import reducer from '../../src/lib/reducer'

export default class Private {
  get reducer() {
    return reducer
  }
  get run() {
    return run
  }
}