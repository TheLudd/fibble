# fibble

Fibble is a small library to insert test doubles into your test. It is heavily
inspired by [quibble](https://github.com/testdouble/quibble) but targeted at es
modules only. It was also made to support [pnpm](https://pnpm.io/) which
creates a slightly different layout in the node_modules folder than other
package managers and is thus built independent of resolution algorithm.

## api

There are two functions exported from fibble:

- `replace(path, replacement)` - Replaces the module at `path` with the replacement.

  - `path` (string) - A path to the module to replace. The path should be relative from the file you are calling `replace` in.
  - `replacement` (object) - The object to replace the replacement to do. The
    object should contain key that you `import` in the file you want to test.
    If you want to stub the default export, name a key `default`.
  - **returns** - Promise. The replacement is async so you should `await` its' completion.

- `reset()` - Removes all registered replacements. All `imports` made after this call will use their native dependencies.

## usage

### setup

There are two modes available depending on the version of node you run. This is because node has changed their API for loaders.

#### modern mode

Use this with node version `18.19.0` and above.

```bash
node --experimental-import-meta-resolve --import fibble/register [my app]
```

#### legacy mode

Use this with node version `18.18.x` and below.

```bash
node --experimental-import-meta-resolve --loader fibble/loader [my app]
```

#### non supported versons

Fibble does not support node version `20.0.0` - `20.5.x`.

### mocha example

This example uses mocha/chai but feel free to use in your favorite test runner.

```javascript
import { describe, beforeEach, it } from 'mocha'
import { expect } from 'chai'
import { replace, reset } from 'fibble'

describe('my module', function(){
  let subject

  beforeEach(async () => {
    await replace ('./path/to/module/to/replace.js', { someProperty: 'some replacement value' })

    subject = await import('./module-to-test.js').default // or the property you want to test
  })

  afterEach(reset) // clear all replacements

  it('contains the stubbed stuff', function() {
    expect(subject(), ...) // to work with the replacemed module
  })
})
```

Setup mocha like this:

```javascript
// .mocharc.cjs
module.exports = {
  'node-option': ['experimental-import-meta-resolve', 'import=fibble/register'],
}
```
