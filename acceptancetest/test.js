import { equal } from 'assert'
import { replace, reset } from '../lib/replace.js'

await replace('pad', { default: (string) => `${string} padded` })
await replace('./stub-me.js', { foo: () => 'bar' })
const { main: withStub } = await import('./file-under-test.js')
equal(withStub, 'processed bar padded')
reset()
// const { main: withoutStub } = await import('./file-under-test.js')
// equal(withoutStub, 'processed foo')
process.stdout.write('\x1B[32mAcceptance test passed\x1B[0m')
