import { loadFactory } from './load.js'
import { resolveFactory } from './resolve.js'
import { FibbleInfo } from './info.js'

const fibbleInfo = new FibbleInfo()

export async function initialize({ port }) {
  port.on('message', (values) => {
    fibbleInfo.setValues(values)
  })
}

export const resolve = resolveFactory(fibbleInfo)
export const load = loadFactory(fibbleInfo)
