export const cleanURL = (url) => url.replace(/\?.*/, '')
export const replaceFileURL = new URL('./replace.js', import.meta.url).href
