import tribbleState from './global-state.js'
import { cleanURL } from './utils.js'
function performReplacement(url) {
  const urlKey = cleanURL(url)
  const replacement = tribbleState.getReplacement(urlKey)
  const source = Object.keys(replacement)
    .map((key) => {
      return `export const ${key} = global.__tribbleState.getReplacementValue('${urlKey}', '${key}')`
    })
    .join('\n')
  return {
    format: 'module',
    source,
    shortCircuit: true,
  }
}

export async function load(url, context, nextLoad) {
  const cleanURL = url.replace(/\?.*$/, '')
  if (tribbleState.hasReplacement(cleanURL)) {
    return performReplacement(url)
  }

  return nextLoad(url, context)
}
