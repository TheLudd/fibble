import { readFile } from 'fs/promises'
import { describe, it } from 'mocha'
import { assert } from 'chai'
import { getSource } from './get-source.js'
import globalState from './global-state.js'

const { equal } = assert

describe('getSource', () => {
  const defaultContext = { format: 'module' }

  const nextGetSource = (url, context) => {
    return `source from ${url} in format ${context.format}`
  }

  it('passes on non replaced urls', async () => {
    const result = await getSource('someurl', defaultContext, nextGetSource)
    const expected = 'source from someurl in format module'
    equal(result, expected)
  })

  it('handles combined default and named replacements', async () => {
    globalState.replace('someUrl', {
      default: 'whatever',
      prop1: 'whatever',
    })
    const result = await getSource('someUrl', defaultContext, nextGetSource)
    const expected = `
export default global.__fibbleState.getReplacementValue('someUrl', 'default')
export const prop1 = global.__fibbleState.getReplacementValue('someUrl', 'prop1')
    `.trim()
    equal(result, expected)
  })

  it('sets parent url in the replace file when it is loaded', async () => {
    const parentURL = 'file:///tmp/some-file.js'
    const { href: url, pathname } = new URL(
      `./replace.js?__fibbleReplaceCaller=${parentURL}`,
      import.meta.url,
    )
    const context = {
      parentURL: import.meta.url,
    }
    const result = await getSource(url, context, nextGetSource)
    const raw = await readFile(pathname, 'utf-8')
    const expected = raw.replace('__PARENT_URL_PLACEHOLDER__', parentURL)
    equal(result, expected)
  })
})
