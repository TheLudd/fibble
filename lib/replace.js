import { resolve } from 'import-meta-resolve'
import { stateFactory } from './state-factory.js'
import { cleanURL } from './utils.js'

const parentURL = '__PARENT_URL_PLACEHOLDER__'

const fibbleState = stateFactory()

export async function replace(relPath, replacement) {
  const fullPath = resolve(relPath, parentURL)
  fibbleState.replace(cleanURL(fullPath), replacement, parentURL)
}

export function reset() {
  fibbleState.reset()
}
