import { resolve } from 'path'

export const cleanURL = (url) => url.replace(/\?.*/, '')
export const replaceFileURL = `file://${resolve('./lib/replace.js')}`
