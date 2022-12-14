import fibbleState from './global-state.js'
import { cleanURL } from './utils.js'
import { generateReplaceFile, performReplacement, replaceURL } from './source-utils.js'

export async function getSource(url, context, nextGetSource) {
  const cleanedURL = cleanURL(url)

  if (cleanedURL === replaceURL) {
    return generateReplaceFile(url)
  }

  if (fibbleState.hasReplacement(cleanedURL)) {
    return performReplacement(url)
  }

  return nextGetSource(url, context)
}
