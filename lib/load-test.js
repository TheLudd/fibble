import { readFile } from 'fs/promises'
import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import { load } from './load.js'
import { stateFactory } from './state-factory.js'

const { deepEqual } = assert

const fibbleState = stateFactory()

describe('load', () => {
  const defaultLoad = (url, context) => ({ url, context, default: true })

  beforeEach(() => {
    fibbleState.reset()
  })

  it('passes non replaced paths to the nextLoad', async () => {
    const result = await load('url', 'context', defaultLoad)
    const expected = { url: 'url', context: 'context', default: true }
    deepEqual(result, expected)
  })

  it('replaces replacements', async () => {
    fibbleState.replace('someUrl', {
      prop1: 'whatever',
      prop2: 'whatever',
    })
    const result = await load('someUrl', 'context', defaultLoad)
    const expectedSource = `
export const prop1 = global.__fibbleState.getReplacementValue('someUrl', 'prop1')
export const prop2 = global.__fibbleState.getReplacementValue('someUrl', 'prop2')
    `.trim()
    const expected = {
      source: expectedSource,
      format: 'module',
      shortCircuit: true,
    }
    deepEqual(result, expected)
  })

  it('handles default replacements', async () => {
    fibbleState.replace('someUrl', {
      default: 'whatever',
    })
    const result = await load('someUrl', 'context', defaultLoad)
    const expectedSource = `
export default global.__fibbleState.getReplacementValue('someUrl', 'default')
    `.trim()
    const expected = {
      source: expectedSource,
      format: 'module',
      shortCircuit: true,
    }
    deepEqual(result, expected)
  })

  it('handles combined default and named replacements', async () => {
    fibbleState.replace('someUrl', {
      default: 'whatever',
      prop1: 'whatever',
    })
    const result = await load('someUrl', 'context', defaultLoad)
    const expectedSource = `
export default global.__fibbleState.getReplacementValue('someUrl', 'default')
export const prop1 = global.__fibbleState.getReplacementValue('someUrl', 'prop1')
    `.trim()
    const expected = {
      source: expectedSource,
      format: 'module',
      shortCircuit: true,
    }
    deepEqual(result, expected)
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
    const result = await load(url, context, defaultLoad)
    const raw = await readFile(pathname, 'utf-8')
    const expectedSource = raw.replace('__PARENT_URL_PLACEHOLDER__', parentURL)
    const expected = {
      source: expectedSource,
      format: 'module',
      shortCircuit: true,
    }
    deepEqual(result, expected)
  })
})
