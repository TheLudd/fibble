import { readFile } from 'fs/promises'
import tribbleState from './global-state.js'
import { cleanURL } from './utils.js'

const { href: replaceURL, pathname: replacePathname } = new URL('./replace.js', import.meta.url)
const replaceFilePromise = readFile(replacePathname, 'utf8')

const shortCircuit = (source) => ({
  source,
  format: 'module',
  shortCircuit: true,
})

const createExportFor = (urlKey) => (key) =>
  `export const ${key} = global.__tribbleState.getReplacementValue('${urlKey}', '${key}')`

function performReplacement(url) {
  const urlKey = cleanURL(url)
  const replacement = tribbleState.getReplacement(urlKey)
  const source = Object.keys(replacement)
    .map(createExportFor(urlKey))
    .join('\n')
  return shortCircuit(source)
}

async function generateReplaceFile (url) {
  const replaceContent = await replaceFilePromise
  const caller = url.split('__tribbleReplaceCaller=')[1]
  return shortCircuit(replaceContent.replace('__PARENT_URL_PLACEHOLDER__', caller))
}


export async function load(url, context, nextLoad) {
  const cleanedURL = cleanURL(url)
  if (cleanedURL === replaceURL) {
    return generateReplaceFile(url)
  }

  if (tribbleState.hasReplacement(cleanedURL)) {
    return performReplacement(url)
  }

  return nextLoad(url, context)
}
