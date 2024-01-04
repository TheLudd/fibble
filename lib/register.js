import { register } from 'node:module'
import { MessageChannel } from 'node:worker_threads'
import { stateFactory } from './state-factory.js'

const { port1: localPort, port2: remotePort } = new MessageChannel()
stateFactory({ useModern: true, localPort })

register('./loader.js', {
  parentURL: import.meta.url,
  data: { port: remotePort },
  transferList: [remotePort],
})
