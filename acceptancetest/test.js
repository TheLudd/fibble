import { equal } from 'assert'
import { replace, reset } from '../lib/replace.js'
import { topValue } from './top-module.js'

await replace('pad', { default: (string) => `${string} padded` })
await replace('./stub-me.js', { foo: () => 'bar' })
const { main: withStub } = await import('./file-under-test.js')

equal(
  withStub,
  'processed bar padded',
  'Original modules were loaded but expected stubs',
)

equal(
  topValue,
  'bottom value processed by middle processed by top',
  'Top module incorectly loaded',
)

await replace('./bottom-module.js', { bottomValue: 'fake bottom value' })
const { middleValue } = await import('./middle-module.js')

equal(
  middleValue,
  'fake bottom value processed by middle',
  'Bottom module not replaced on second load',
)

reset()
const { main: withoutStub } = await import('./file-under-test.js')
equal(withoutStub, 'processed foo--', 'Replacements were not reset')
process.stdout.write('\x1B[32mAcceptance test passed\x1B[0m')
