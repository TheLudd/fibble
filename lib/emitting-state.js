import { FibbleState } from './state.js'

export class EmittingState extends FibbleState {
  constructor(localPort) {
    super()
    this.localPort = localPort
  }

  replace(fullPath, replacement) {
    super.replace(fullPath, replacement)
    this.localPort.postMessage(this.getValues())
  }
}
