import { replaceFileURL } from './utils.js'

const shortCircuit = (url) => ({ url, format: 'module', shortCircuit: true })

export const resolveFactory = (fibbleInfo) => {
  return async function resolve(specifier, context, nextResolve) {
    const nr = await nextResolve(specifier, context)
    const { url } = nr

    if (url === replaceFileURL) {
      return shortCircuit(`${url}?__fibbleReplaceCaller=${context.parentURL}`)
    }

    const { parentURL } = context
    const count = fibbleInfo.getURLCount(url, parentURL)
    return count != null ? shortCircuit(`${url}?__fibbleCount=${count}`) : nr
  }
}
