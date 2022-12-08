import { TribbleState } from './state.js'

if (global.__tribbleLoaded !== true) {
  global.__tribbleState = new TribbleState()
}
global.__tribbleLoaded = true

export default global.__tribbleState

