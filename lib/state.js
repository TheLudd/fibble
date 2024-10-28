import { FibbleInfo } from './info.js'

export class FibbleState extends FibbleInfo {
  constructor() {
    super()
    this.replacements = {}
  }

  replace(fullPath, replacement, parentURL) {
    const allReplacementKeys = Object.keys(replacement)
    const replacementKeys = allReplacementKeys.filter((k) => k !== 'default')
    const currentCount = this.counts[fullPath] || 0
    const currentReplacedFromCount = this.replacedFromCount[parentURL] || 0

    this.replacedFiles.push(fullPath)
    this.replacedFrom.push(parentURL)
    this.counts[fullPath] = currentCount + 1
    this.replacedFromCount[parentURL] = currentReplacedFromCount + 1
    this.replacements[fullPath] = replacement
    this.replacementKeys[fullPath] = replacementKeys
    if (allReplacementKeys.length > replacementKeys.length) {
      this.defaultReplacements[fullPath] = true
    }
  }

  reset() {
    this.replacedFiles = []
    this.replacedFrom = []
    this.replacements = {}
    this.replacementKeys = {}
    this.defaultReplacements = {}
  }

  getReplacement(fullPath) {
    return this.replacements[fullPath]
  }

  getReplacementValue(fullPath, key) {
    return this.replacements[fullPath][key]
  }
}
