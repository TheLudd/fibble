import tribbleState from './state.js'

function performReplacement (url) {
  const replacement = tribbleState.getReplacement(url)
  const source = Object.keys(replacement).map((key) => {
    return `export const ${key} = global.__tribbleState.getReplacementValue('${url}', '${key}')`
  }).join('\n')
  return {
    format: 'module',
    source,
    shortCircuit: true,
  }
}

export async function resolve (specifier, context, nextResolve) {
  const newSpecifier = specifier === './replace.js'
    ? `${specifier}?__tribbleParent=${context.parentURL}`
    : specifier
  return nextResolve(newSpecifier, context)
}

export async function load(url, context, nextLoad) {
  return tribbleState.hasReplacement(url) 
    ? performReplacement(url)
    : nextLoad(url, context)
}
