import { replaceFileURL } from './utils.js'

const shortCircuit = (url, format) => ({
  url,
  format: format ?? 'module',
  shortCircuit: true,
})

const toResolveResult = (fibbleInfo, nextResult, context) => {
  const { url } = nextResult

  if (url === replaceFileURL) {
    return shortCircuit(`${url}?__fibbleReplaceCaller=${context.parentURL}`)
  }

  const count = fibbleInfo.getURLCount(url, context.parentURL)
  return count != null
    ? shortCircuit(`${url}?__fibbleCount=${count}`, nextResult.format)
    : nextResult
}

export const resolveFactory = (fibbleInfo) =>
  async function resolve(specifier, context, nextResolve) {
    const nextResult = await nextResolve(specifier, context)
    return toResolveResult(fibbleInfo, nextResult, context)
  }

export const resolveSyncFactory = (fibbleInfo) =>
  function resolve(specifier, context, nextResolve) {
    const nextResult = nextResolve(specifier, context)
    return toResolveResult(fibbleInfo, nextResult, context)
  }
