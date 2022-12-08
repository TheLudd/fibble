export class TribbleState {
  constructor() {
    this.replacements = {}
    this.counts = {}
  }

  replace(fullPath, replacement) {
    const currentCount = this.counts[fullPath] || 0
    this.counts[fullPath] = currentCount + 1
    this.replacements[fullPath] = replacement
  }

  reset() {
    Object.keys(this.replacements).forEach((key) => {
      this.counts[key] += 1
    })
    this.replacements = {}
  }

  getReplacement(fullPath) {
    return this.replacements[fullPath]
  }

  getReplacementValue(fullPath, key) {
    return this.replacements[fullPath][key]
  }

  hasReplacement(fullPath) {
    return this.replacements[fullPath] != null
  }

  getURLCount(fullPath) {
    return this.counts[fullPath]
  }
}
