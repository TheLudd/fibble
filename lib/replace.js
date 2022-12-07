import tribbleState from './state.js'

export async function replace(relPath, replacement, parent) {
  const fullPath = await import.meta.resolve(relPath, parent)
  tribbleState.replace(fullPath, replacement)
}

