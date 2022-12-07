import { equal } from 'assert'
import { replace } from '../lib/replace.js'

const main = async () => {
	await replace('./foo.js', { foo: () => 'bar' }, import.meta.url)
	const { result } = await import('./app.js')
	equal(result, 'processed bar')
}

main()
