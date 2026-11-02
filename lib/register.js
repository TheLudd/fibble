import * as nodeModule from 'node:module'
import { MessageChannel } from 'node:worker_threads'
import { stateFactory } from './state-factory.js'
import { loadFactory } from './load.js'
import { resolveSyncFactory } from './resolve.js'

function registerInThread() {
  const fibbleState = stateFactory()
  nodeModule.registerHooks({
    resolve: resolveSyncFactory(fibbleState),
    load: loadFactory(fibbleState),
  })
}

function registerOffThread() {
  const { port1: localPort, port2: remotePort } = new MessageChannel()
  stateFactory({ useModern: true, localPort })

  nodeModule.register('./loader.js', {
    parentURL: import.meta.url,
    data: { port: remotePort },
    transferList: [remotePort],
  })
}

if (nodeModule.registerHooks != null) {
  registerInThread()
} else {
  registerOffThread()
}
