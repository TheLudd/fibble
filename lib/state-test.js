import { assert } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { FibbleState } from './state.js'

const { equal, isUndefined, isTrue, isFalse } = assert

describe('state', () => {
  let state
  beforeEach(() => {
    state = new FibbleState()
  })

  const path = 'somePath'
  const replacement = { someKey: 'someValue' }
  describe('set replacement', () => {
    beforeEach(() => {
      state.replace(path, replacement)
    })

    it('lets you retreive the replacement', () => {
      const result = state.getReplacement(path)
      equal(result, replacement)
    })

    it('gives you a count of how many times it has been replaced', () => {
      equal(state.getURLCount(path), 1)
      isUndefined(state.getURLCount('someUnknownPath'))
    })

    it('allows checks for if the replacement has been made', () => {
      isTrue(state.hasReplacement(path))
      isFalse(state.hasReplacement('someUnknownPath'))
    })

    it('allows retreivals of keys in the replacement', () => {
      const result = state.getReplacementValue(path, 'someKey')
      equal(result, 'someValue')
    })
  })

  describe('reset', () => {
    beforeEach(() => {
      state.replace(path, replacement)
      state.reset(path, replacement)
    })

    it('removes all replacements', () => {
      isUndefined(state.getReplacement(path))
      isFalse(state.hasReplacement(path))
    })

    it('increases the count for all repaced items', () => {
      equal(state.getURLCount(path), 2)
    })

    it('does not affect count for non replaced items', () => {
      isUndefined(state.getURLCount('someUnknownPath'))
    })
  })
})
