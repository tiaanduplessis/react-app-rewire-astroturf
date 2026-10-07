const assert = require('assert')
const rewireAstroturf = require('../')

function fixture () {
  return {
    mode: 'development',
    module: { rules: [{ test: /\.css$/, use: ['existing-css-loader'] }] },
    plugins: [{ name: 'existing-plugin' }]
  }
}

const config = fixture()
const originalRule = config.module.rules[0]
const originalPlugins = config.plugins
assert.strictEqual(rewireAstroturf(config, 'development'), config)
assert.strictEqual(config.module.rules.length, 2)
assert.strictEqual(config.module.rules[0], originalRule)
assert.strictEqual(config.plugins, originalPlugins)
assert.strictEqual(config.mode, 'development')
const rule = config.module.rules[1]
assert.strictEqual(rule.use.length, 1)
assert.strictEqual(rule.use[0].loader, 'astroturf/loader')
assert.deepStrictEqual(rule.use[0].options, { extension: '.module.css' })
for (const extension of ['js', 'mjs', 'jsx', 'ts', 'tsx']) {
  assert(rule.test.test('component.' + extension), extension)
}
for (const filename of ['component.css', 'component.json', 'component.js.map', 'component.jsx.txt']) {
  assert.strictEqual(rule.test.test(filename), false, filename)
}

const options = Object.freeze({ extension: '.custom.css', allowGlobal: true })
const production = fixture()
rewireAstroturf(production, 'production', options)
const configured = production.module.rules[1].use[0].options
assert.deepStrictEqual(configured, { extension: '.custom.css', allowGlobal: true })
assert.notStrictEqual(configured, options)
assert.deepStrictEqual(options, { extension: '.custom.css', allowGlobal: true })

const another = fixture()
rewireAstroturf(another)
assert.notStrictEqual(another.module.rules[1].use[0].options, rule.use[0].options)
assert.deepStrictEqual(another.module.rules[1].use[0].options, { extension: '.module.css' })
console.log('Wrapper contract checks passed')
