import { readFile } from 'fs/promises'
import fibbleState from './global-state.js'
import { cleanURL } from './utils.js'

const { href: replaceURL, pathname: replacePathname } = new URL(
  './replace.js',
  import.meta.url,
)

export { replaceURL }

const replaceFilePromise = readFile(replacePathname, 'utf8')

const createExportFor = (urlKey) => (key) =>
  `export const ${key} = global.__fibbleState.getReplacementValue('${urlKey}', '${key}')`

const createDefaultExport = (urlKey) =>
  `export default global.__fibbleState.getReplacementValue('${urlKey}', 'default')`

export function performReplacement(url) {
  const urlKey = cleanURL(url)
  const replacement = fibbleState.getReplacement(urlKey)
  const { default: defaultExport, ...rest } = replacement

  const defaultExportRows =
    defaultExport != null ? [createDefaultExport(urlKey)] : []

  const namedExportRows = Object.keys(rest).map(createExportFor(urlKey))

  return [...defaultExportRows, ...namedExportRows].join('\n')
}

export async function generateReplaceFile(url) {
  const replaceContent = await replaceFilePromise
  const caller = url.split('__fibbleReplaceCaller=')[1]
  return replaceContent.replace('__PARENT_URL_PLACEHOLDER__', caller)
}
