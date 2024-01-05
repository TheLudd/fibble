export class FibbleInfo {
  constructor() {
    this.defaultReplacements = {}
    this.counts = {}
    this.replacementKeys = {}
  }

  setValues({ defaultReplacements, counts, replacementKeys }) {
    this.defaultReplacements = defaultReplacements
    this.counts = counts
    this.replacementKeys = replacementKeys
  }

  getValues() {
    return {
      defaultReplacements: this.defaultReplacements,
      counts: this.counts,
      replacementKeys: this.replacementKeys,
    }
  }

  getReplacementKeys(fullPath) {
    return this.replacementKeys[fullPath] ?? []
  }

  hasReplacement(fullPath) {
    return this.defaultReplacements[fullPath] ?? this.replacementKeys[fullPath] != null
  }

  hasDefaultReplacement(fullPath) {
    return this.defaultReplacements[fullPath] === true
  }

  getURLCount(fullPath) {
    return this.counts[fullPath]
  }
}
