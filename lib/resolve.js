import { stateFactory } from './state-factory.js'
import { replaceFileURL } from './utils.js'

const fibbleState = stateFactory()

const shortCircuit = (url) => ({ url, format: 'module', shortCircuit: true })

export async function resolve(specifier, context, nextResolve) {
  const nr = await nextResolve(specifier, context)
  const { url } = nr

  if (url === replaceFileURL) {
    return shortCircuit(`${url}?__fibbleReplaceCaller=${context.parentURL}`)
  }

  const count = fibbleState.getURLCount(url)
  return count != null
    ? shortCircuit(`${url}?__fibbleCount=${count}`)
    : nextResolve(specifier, context)
}
