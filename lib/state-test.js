import { assert } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { FibbleState } from './state.js'

const { deepEqual, equal, isUndefined, isTrue, isFalse } = assert

describe('state', () => {
  let state
  beforeEach(() => {
    state = new FibbleState()
  })

  const path = 'somePath'
  const pathWithDefault = 'somePathWithDefault'
  const replacement = { someKey: 'someValue' }
  const replacementWithDefault = { default: 'someDefault' }
  const replacedFrom = 'someParentURL'
  describe('set replacement', () => {
    beforeEach(() => {
      state.replace(path, replacement, replacedFrom)
      state.replace(pathWithDefault, replacementWithDefault, replacedFrom)
    })

    it('lets you retreive the replacement', () => {
      const result = state.getReplacement(path)
      equal(result, replacement)
    })

    it('gives you a count of how many times it has been replaced', () => {
      equal(state.getURLCount(path, replacedFrom), 1)
      isUndefined(state.getURLCount('someUnknownPath', 'someUnknownParent'))
    })

    it('allows checks for if the replacement has been made', () => {
      isTrue(state.hasReplacement(path))
      isFalse(state.hasReplacement('someUnknownPath'))
    })

    it('allows retreivals of keys in the replacement', () => {
      const result = state.getReplacementValue(path, 'someKey')
      equal(result, 'someValue')
    })

    it('allows retreivals of keys in the replacement', () => {
      const result = state.getReplacementKeys(path)
      deepEqual(result, ['someKey'])
    })

    it('handles replacements without any keys', () => {
      deepEqual(state.getReplacementKeys(pathWithDefault), [])
      deepEqual(state.getReplacementKeys('someUnknownPath'), [])
    })

    it('determines if a replacement has a default value', () => {
      isTrue(state.hasDefaultReplacement(pathWithDefault))
      isFalse(state.hasDefaultReplacement(path))
      isFalse(state.hasDefaultReplacement('someUnknownPath'))
    })

    it('returns a count for paths resolved from the parent url', () => {
      equal(
        state.getURLCount('someUnknownPath', replacedFrom),
        'someParentURL-2',
      )
    })
  })

  describe('reset', () => {
    beforeEach(() => {
      state.replace(path, replacement, replacedFrom)
      state.replace(pathWithDefault, replacementWithDefault, replacedFrom)
      state.reset(path, replacement)
    })

    it('removes all replacements', () => {
      isUndefined(state.getReplacement(path))
      isFalse(state.hasReplacement(path))
    })

    it('resets the replacement keys', () => {
      deepEqual(state.getReplacementKeys(path), [])
    })

    it('resets the default replacement', () => {
      isFalse(state.hasDefaultReplacement(pathWithDefault))
    })

    it('increases the count for all repaced items', () => {
      equal(state.getURLCount(path, replacedFrom), 2)
    })

    it('does not affect count for non replaced items', () => {
      isUndefined(state.getURLCount('someUnknownPath', 'someUnknownParent'))
    })
  })
})
