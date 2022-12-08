import tribbleState from './state.js'
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

export async function resolve(specifier, context, nextResolve) {
  const { href: url } = new URL(specifier, context.parentURL)
  const count = tribbleState.getURLCount(url)
  const newSpecifier =
    count != null ? `${url}?__tribbleCount=${count}` : specifier
  return nextResolve(newSpecifier, context)
}

export async function load(url, context, nextLoad) {
  const cleanURL = url.replace(/\?.*$/, '')
  if (tribbleState.hasReplacement(cleanURL)) {
    return performReplacement(url)
  }

  return nextLoad(url, context)
}
