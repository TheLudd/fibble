import tribbleState from './global-state.js'
import { cleanURL } from './utils.js'

export async function replace(relPath, replacement, parent) {
  const fullPath = await import.meta.resolve(relPath, parent)
  tribbleState.replace(cleanURL(fullPath), replacement)
}

export function reset () {
  tribbleState.reset()
}
