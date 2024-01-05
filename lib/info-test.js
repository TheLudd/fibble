import { assert } from 'chai'
import { describe, it } from 'mocha'
import { FibbleInfo } from './info.js'

const { isTrue, isFalse, equal, deepEqual } = assert

describe('FibbleInfo', () => {
  const info = new FibbleInfo()
  info.setValues({
    defaultReplacements: {
      withDefault: true,
      withBoth: true,
    },
    replacementKeys: {
      withBoth: ['a', 'b'],
      withKeys: ['c'],
    },
    counts: {
      withDefault: 1,
      withBoth: 2,
      withKeys: 3,
    },
  })

  describe('hasReplacement', () => {
    it('returns true for default replacements', () => {
      isTrue(info.hasReplacement('withDefault'))
    })

    it('returns true for replacements with keys', () => {
      isTrue(info.hasReplacement('withKeys'))
    })

    it('returns true for replacements with both default and keys', () => {
      isTrue(info.hasReplacement('withBoth'))
    })

    it('returns false for unknown replacements', () => {
      isFalse(info.hasReplacement('unknown'))
    })
  })

  describe('getReplacementKeys', () => {
    it('returns empty array for default replacements', () => {
      deepEqual(info.getReplacementKeys('withDefault'), [])
    })

    it('returns keys for replacements with keys', () => {
      deepEqual(info.getReplacementKeys('withKeys'), ['c'])
    })

    it('returns keys for replacements with both default and keys', () => {
      deepEqual(info.getReplacementKeys('withBoth'), ['a', 'b'])
    })

    it('returns empty array for unknown replacements', () => {
      deepEqual(info.getReplacementKeys('unknown'), [])
    })
  })

  describe('hasDefaultReplacement', () => {
    it('returns true for default replacements', () => {
      isTrue(info.hasDefaultReplacement('withDefault'))
    })

    it('returns false for replacements with keys', () => {
      isFalse(info.hasDefaultReplacement('withKeys'))
    })

    it('returns true for replacements with both default and keys', () => {
      isTrue(info.hasDefaultReplacement('withBoth'))
    })

    it('returns false for unknown replacements', () => {
      isFalse(info.hasDefaultReplacement('unknown'))
    })
  })

  describe('getURLCount', () => {
    it('returns count for default replacements', () => {
      equal(info.getURLCount('withDefault'), 1)
    })

    it('returns count for replacements with both default and keys', () => {
      equal(info.getURLCount('withBoth'), 2)
    })

    it('returns count for replacements with keys', () => {
      equal(info.getURLCount('withKeys'), 3)
    })

    it('returns undefined for unknown replacements', () => {
      equal(info.getURLCount('unknown'), undefined)
    })
  })
})
