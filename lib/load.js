import { readFileSync } from 'fs'
import { cleanURL } from './utils.js'

const { href: replaceURL, pathname: replacePathname } = new URL(
  './replace.js',
  import.meta.url,
)
const replaceFileContent = readFileSync(replacePathname, 'utf8')

const shortCircuit = (source) => ({
  source,
  format: 'module',
  shortCircuit: true,
})

const createExportFor = (urlKey) => (key) =>
  `export const ${key} = global.__fibbleState.getReplacementValue('${urlKey}', '${key}')`

const createDefaultExport = (urlKey) =>
  `export default global.__fibbleState.getReplacementValue('${urlKey}', 'default')`

function performReplacement(fibbleInfo, url) {
  const urlKey = cleanURL(url)

  const defaultExportRows = fibbleInfo.hasDefaultReplacement(urlKey)
    ? [createDefaultExport(urlKey)]
    : []

  const namedExportRows = fibbleInfo
    .getReplacementKeys(urlKey)
    .map(createExportFor(urlKey))

  return shortCircuit([...defaultExportRows, ...namedExportRows].join('\n'))
}

function generateReplaceFile(url) {
  const caller = url.split('__fibbleReplaceCaller=')[1]
  return shortCircuit(
    replaceFileContent.replace('__PARENT_URL_PLACEHOLDER__', caller),
  )
}

export const loadFactory = (fibbleInfo) => {
  return function load(url, context, nextLoad) {
    const cleanedURL = cleanURL(url)
    if (cleanedURL === replaceURL) {
      return generateReplaceFile(url)
    }

    if (fibbleInfo.hasReplacement(cleanedURL)) {
      return performReplacement(fibbleInfo, url)
    }

    return nextLoad(url, context)
  }
}
