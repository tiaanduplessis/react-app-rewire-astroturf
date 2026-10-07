const assert = require('assert')
const path = require('path')

function from (name, parent) {
  return require.resolve(name, { paths: [path.dirname(parent)] })
}

const astroturf = require.resolve('astroturf/package.json')
const cssLoader = from('css-loader/package.json', astroturf)
const postcssLoader = from('postcss-loader/package.json', astroturf)
const babel = from('@babel/core/package.json', astroturf)
const loaders = [
  from('loader-utils', astroturf),
  from('loader-utils', cssLoader),
  from('loader-utils', postcssLoader)
]

for (const filename of loaders) {
  const loader = require(filename)
  const query = loader.parseQuery('?name=button&enabled=true&items[]=one&items[]=two')
  assert.strictEqual(query.name, 'button')
  assert.strictEqual(query.enabled, true)
  assert.deepStrictEqual(query.items, ['one', 'two'])
  assert.strictEqual(Object.getPrototypeOf(query), null)
  const prototype = loader.parseQuery('?__proto__=value&constructor=safe')
  assert.strictEqual(Object.getPrototypeOf(prototype), null)
  assert.strictEqual(Object.getOwnPropertyDescriptor(prototype, '__proto__').value, 'value')
  assert.strictEqual(prototype.constructor, 'safe')
  assert.deepStrictEqual(loader.getOptions({ query: '?{extension:".module.css"}' }), {
    extension: '.module.css'
  })
  assert.strictEqual(loader.interpolateName(
    { resourcePath: '/fixtures/button.module.css' }, '[name].[ext]', {}
  ), 'button.module.css')
}

const jsonParsers = loaders.map(filename => from('json5', filename))
jsonParsers.push(from('json5', babel))
for (const filename of jsonParsers) {
  const json5 = require(filename)
  assert.deepStrictEqual(json5.parse('{name:"button", trailing:true,}'), {
    name: 'button', trailing: true
  })
  const parsed = json5.parse('{"__proto__":{"probe":true}}')
  assert.strictEqual(Object.getPrototypeOf(parsed), Object.prototype)
  assert.strictEqual(Object.prototype.hasOwnProperty.call(parsed, '__proto__'), true)
  assert.deepStrictEqual(Object.getOwnPropertyDescriptor(parsed, '__proto__').value, { probe: true })
  assert.strictEqual(parsed.probe, undefined)
}

const json5v1 = from('json5/package.json', loaders[1])
const minimist = require(from('minimist', json5v1))
const args = minimist(['--name', 'button', '--__proto__.probe', 'true'])
assert.strictEqual(args.name, 'button')
assert.strictEqual(Object.prototype.probe, undefined)
assert.strictEqual(args.probe, undefined)

const lodash = require(from('lodash', astroturf))
const template = require(from('lodash/template', astroturf))
const fromPairs = require(from('lodash/fromPairs', astroturf))
assert.strictEqual(template('Hello <%= name %>')({ name: 'button' }), 'Hello button')
assert.deepStrictEqual(fromPairs([['name', 'button']]), { name: 'button' })
assert.throws(() => template('text', { imports: { 'invalid,key': 'value' } }), /Invalid `imports` option/)
function Component () {}
Component.prototype.marker = true
const instance = new Component()
lodash.unset(instance, [['constructor'], 'prototype', 'marker'])
assert.strictEqual(Component.prototype.marker, true)
lodash.omit(instance, [[['constructor'], 'prototype', 'marker']])
assert.strictEqual(Component.prototype.marker, true)

const traverse = require(from('astroturf/traverse', astroturf)).default
const source = 'import { css } from "astroturf"; const height = 12; ' +
  'export const styles = css`.button { height: ${height}px; color: blue; }`;' // eslint-disable-line no-template-curly-in-string
const result = traverse(source, path.join(__dirname, 'component.js'), {
  extension: '.module.css', writeFiles: false
})
assert.strictEqual(result.metadata.astroturf.styles.length, 1)
const style = result.metadata.astroturf.styles[0]
assert(style.absoluteFilePath.endsWith('.module.css'))
assert(style.value.includes('height: 12px'))
assert(style.value.includes('color: blue'))
assert(result.metadata.astroturf.changeset.length > 0)
console.log('Locked dependency and astroturf plugin checks passed')
