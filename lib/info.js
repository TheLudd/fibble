export class FibbleInfo {
  constructor() {
    this.defaultReplacements = {}
    this.counts = {}
    this.replacementKeys = {}
    this.replacedFromCount = {}
    this.replacedFiles = []
    this.replacedFrom = []
  }

  setValues({
    defaultReplacements,
    counts,
    replacementKeys,
    replacedFromCount,
    replacedFiles,
    replacedFrom,
  }) {
    this.defaultReplacements = defaultReplacements
    this.counts = counts
    this.replacementKeys = replacementKeys
    this.replacedFromCount = replacedFromCount
    this.replacedFiles = replacedFiles
    this.replacedFrom = replacedFrom
  }

  getValues() {
    return {
      defaultReplacements: this.defaultReplacements,
      counts: this.counts,
      replacementKeys: this.replacementKeys,
      replacedFromCount: this.replacedFromCount,
      replacedFiles: this.replacedFiles,
      replacedFrom: this.replacedFrom,
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
    if (this.replacedFiles.includes(fullPath)) {
      const pathCount = this.counts[fullPath]
      if (pathCount != null) return pathCount
    }
    if (this.replacedFrom.includes(parentURL)) {
      const parentCount = this.replacedFromCount[parentURL]
      if (parentCount != null) return `${parentURL}-${parentCount}`
    }
  }
}
