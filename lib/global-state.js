import { FibbleState } from './state.js'

if (global.__fibbleLoaded !== true) {
  global.__fibbleState = new FibbleState()
}
global.__fibbleLoaded = true

export default global.__fibbleState
