import { readFile } from 'fs/promises'
import { stateFactory } from './state-factory.js'
import { cleanURL } from './utils.js'

const fibbleState = stateFactory()

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
  `export const ${key} = global.__fibbleState.getReplacementValue('${urlKey}', '${key}')`

const createDefaultExport = (urlKey) =>
  `export default global.__fibbleState.getReplacementValue('${urlKey}', 'default')`

function performReplacement(url) {
  const urlKey = cleanURL(url)

  const defaultExportRows = fibbleState.hasDefaultReplacement(urlKey)
    ? [createDefaultExport(urlKey)]
    : []

  const namedExportRows = fibbleState
    .getReplacementKeys(urlKey)
    .map(createExportFor(urlKey))

  return shortCircuit([...defaultExportRows, ...namedExportRows].join('\n'))
}

async function generateReplaceFile(url) {
  const replaceContent = await replaceFilePromise
  const caller = url.split('__fibbleReplaceCaller=')[1]
  return shortCircuit(
    replaceContent.replace('__PARENT_URL_PLACEHOLDER__', caller),
  )
}

export async function load(url, context, nextLoad) {
  const cleanedURL = cleanURL(url)
  if (cleanedURL === replaceURL) {
    return generateReplaceFile(url)
  }

  if (fibbleState.hasReplacement(cleanedURL)) {
    return performReplacement(url)
  }

  return nextLoad(url, context)
}
