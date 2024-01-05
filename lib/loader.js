import { stateFactory } from './state-factory.js'
import { loadFactory } from './load.js'
import { resolveFactory } from './resolve.js'

const fibbleState = stateFactory()

export const resolve = resolveFactory(fibbleState)
export const load = loadFactory(fibbleState)
