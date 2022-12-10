import tribbleState from './global-state.js'
import { replaceFileURL } from './utils.js'

const shortCircuit = (url) => ({ url, format: 'module', shortCircuit: true })

export async function resolve(specifier, context, nextResolve) {
  const nr = await nextResolve(specifier, context)
  const { url } = nr

  if (url === replaceFileURL) {
    return shortCircuit(`${url}?__tribbleReplaceCaller=${context.parentURL}`)
  }

  const count = tribbleState.getURLCount(url)
  return count != null
    ? shortCircuit(`${url}?__tribbleCount=${count}`)
    : nextResolve(specifier, context)
}
