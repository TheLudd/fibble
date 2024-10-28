import { FibbleState } from './state.js'

export class EmittingState extends FibbleState {
  constructor(localPort) {
    super()
    this.localPort = localPort
  }

  replace(fullPath, replacement, parentURL) {
    super.replace(fullPath, replacement, parentURL)
    this.localPort.postMessage(this.getValues())
  }

  reset() {
    super.reset()
    this.localPort.postMessage(this.getValues())
  }
}
