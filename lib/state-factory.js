import { FibbleState } from './state.js'

export const stateFactory = () => {
  if (global.__fibbleLoaded !== true) {
    global.__fibbleState = new FibbleState()
  }
  global.__fibbleLoaded = true
  return global.__fibbleState
}
