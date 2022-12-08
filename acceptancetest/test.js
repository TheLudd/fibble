import { equal } from 'assert'
import { replace } from '../lib/replace.js'

await replace('./stub-me.js', { foo: () => 'bar' }, import.meta.url)
const { result } = await import('./file-under-test.js')
equal(result, 'processed bar')
