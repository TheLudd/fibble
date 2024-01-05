import { resolve as pathResolve } from 'path'
import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import { resolve } from './resolve.js'
import { stateFactory } from './state-factory.js'
import { replaceFileURL } from './utils.js'

const { deepEqual } = assert

describe('resolve', () => {
  const sampleURL = new URL(`file://${pathResolve('./some-file.js')}`)
  const context = { parentURL: 'file:///tmp/a-caller.js' }
  const fibbleState = stateFactory()

  const fakeFindURL = (specifier, c = context) => {
    return specifier === './lib/replace.js'
      ? replaceFileURL
      : `${specifier} resolved with ${c.parentURL}`
  }

  const defaultResolver = (specifier, context) => ({
    url: fakeFindURL(specifier, context),
  })

  beforeEach(() => {
    fibbleState.reset()
  })

  it('passes non replaced paths to the next resolver', async () => {
    const specifier = './some-path.js'
    const result = await resolve(specifier, context, defaultResolver)
    const expected = {
      url: `./some-path.js resolved with ${context.parentURL}`,
    }
    deepEqual(result, expected)
  })

  it('adds a count query parameter to replaced dependencies', async () => {
    const replacedFile = './replaced-file.js'
    const resolvedURL = `${replacedFile} resolved with ${context.parentURL}`
    fibbleState.replace(resolvedURL, 'whatever')
    const result = await resolve(replacedFile, context, defaultResolver)
    const expected = {
      shortCircuit: true,
      url: `${resolvedURL}?__fibbleCount=1`,
      format: 'module',
    }
    deepEqual(result, expected)
  })

  it('adds the parentURL as a query param if the file is the replace file', async () => {
    const c = {
      parentURL: sampleURL.href,
    }
    const result = await resolve('./lib/replace.js', c, defaultResolver)
    const resolveFileURL = new URL('./lib/replace.js', sampleURL).href
    const expected = {
      shortCircuit: true,
      url: `${resolveFileURL}?__fibbleReplaceCaller=${c.parentURL}`,
      format: 'module',
    }
    deepEqual(result, expected)
  })
})
