import fibbleState from './global-state.js'
import { cleanURL } from './utils.js'

const parentURL = '__PARENT_URL_PLACEHOLDER__'

export async function replace(relPath, replacement) {
  const fullPath = await import.meta.resolve(relPath, parentURL)
  fibbleState.replace(cleanURL(fullPath), replacement)
}

export function reset() {
  fibbleState.reset()
}
