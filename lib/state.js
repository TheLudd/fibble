class TribbleState {
	constructor () {
		this.replacements = {}
	}

	setCaller(c) {
		this.caller = c
	}

	getCaller() {
		return this.caller
	}

	replace (fullPath, replacement) {
		this.replacements[fullPath] = replacement
	}

	getReplacement (fullPath) {
		return this.replacements[fullPath]
	}

	getReplacementValue (fullPath, key) {
		return this.replacements[fullPath][key]
	}

	hasReplacement (fullPath) {
		return this.replacements[fullPath] != null
	}
}

if (global.__tribbleLoaded !== true) {
	global.__tribbleState = new TribbleState()
}
global.__tribbleLoaded = true

export default global.__tribbleState

export function resolvePath (specifier, parent) {
	return import.meta.resolve(specifier, parent)
}
