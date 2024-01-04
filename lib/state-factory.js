import { FibbleState } from './state.js'
import { EmittingState } from './emitting-state.js'

export const stateFactory = (opts = {}) => {
  if (global.__fibbleLoaded !== true) {
    const { useModern = false, localPort } = opts
    const fibbleState = useModern
      ? new EmittingState(localPort)
      : new FibbleState()
    global.__fibbleState = fibbleState
  }
  global.__fibbleLoaded = true
  return global.__fibbleState
}
