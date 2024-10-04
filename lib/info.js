export class FibbleInfo {
  constructor() {
    this.defaultReplacements = {}
    this.counts = {}
    this.replacementKeys = {}
    this.replacedFromCount = {}
  }

  setValues({
    defaultReplacements,
    counts,
    replacementKeys,
    replacedFromCount,
  }) {
    this.defaultReplacements = defaultReplacements
    this.counts = counts
    this.replacementKeys = replacementKeys
    this.replacedFromCount = replacedFromCount
  }

  getValues() {
    return {
      defaultReplacements: this.defaultReplacements,
      counts: this.counts,
      replacementKeys: this.replacementKeys,
      replacedFromCount: this.replacedFromCount,
    }
  }

  getReplacementKeys(fullPath) {
    return this.replacementKeys[fullPath] ?? []
  }

  hasReplacement(fullPath) {
    return (
      this.defaultReplacements[fullPath] ??
      this.replacementKeys[fullPath] != null
    )
  }

  hasDefaultReplacement(fullPath) {
    return this.defaultReplacements[fullPath] === true
  }

  getURLCount(fullPath, parentURL) {
    const pathCount = this.counts[fullPath]
    if (pathCount != null) return pathCount
    const parentCount = this.replacedFromCount[parentURL]
    if (parentCount != null) return `${parentURL}-${parentCount}`
  }
}
