import { readFile } from 'fs/promises'
import tribbleState from './global-state.js'
import { cleanURL } from './utils.js'

const { href: replaceURL, pathname: replacePathname } = new URL(
  './replace.js',
  import.meta.url,
)
const replaceFilePromise = readFile(replacePathname, 'utf8')

const shortCircuit = (source) => ({
  source,
  format: 'module',
  shortCircuit: true,
})

const createExportFor = (urlKey) => (key) =>
  `export const ${key} = global.__tribbleState.getReplacementValue('${urlKey}', '${key}')`

const createDefaultExport = (urlKey) =>
  `export default global.__tribbleState.getReplacementValue('${urlKey}', 'default')`

function performReplacement(url) {
  const urlKey = cleanURL(url)
  const replacement = tribbleState.getReplacement(urlKey)
  const { default: defaultExport, ...rest } = replacement

  const defaultExportRows =
    defaultExport != null ? [createDefaultExport(urlKey)] : []

  const namedExportRows = Object.keys(rest).map(createExportFor(urlKey))

  return shortCircuit([...defaultExportRows, ...namedExportRows].join('\n'))
}

async function generateReplaceFile(url) {
  const replaceContent = await replaceFilePromise
  const caller = url.split('__tribbleReplaceCaller=')[1]
  return shortCircuit(
    replaceContent.replace('__PARENT_URL_PLACEHOLDER__', caller),
  )
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
