'use strict'

const os = require('os')
const path = require('path')
const assert = require('chai').assert
const uuid = require('uuid/v4')
const index = require('./../src/index')

const fsify = require('fsify')({
	cwd: os.tmpdir()
})

describe('index()', function() {

	it('should return an error when called without a filePath', async function() {

		return index().then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `'filePath' must be a string`)

		})

	})

	it('should return an error when called with invalid options', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.htl`
			}
		])

		return index(structure[0].name, '').then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `'opts' must be undefined or an object`)

		})

	})

	it('should return an error when called with a fictive filePath', async function() {

		return index(`${ uuid() }.htl`).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should load empty Sightly and transform it to HTML', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.htl`,
				contents: ''
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, structure[0].contents)

	})

	it('should load Sightly and transform it to HTML', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.htl`,
				contents: '${ environment }'
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, 'dev')

	})

	it('should load Sightly and transform it to HTML with custom global data', async function() {

		const data = { key: 'value' }

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.htl`,
				contents: '${key}'
			}
		])

		const result = await index(structure[0].name, { data })

		assert.strictEqual(result, data.key)

	})

	it('should load Sightly and transform it to HTML with external custom global data', async function() {

		const data = { key: 'value' }

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.htl`,
				contents: '${key}'
			},
			{
				type: fsify.FILE,
				name: `${ uuid() }.json`,
				contents: JSON.stringify(data)
			}
		])

		const result = await index(structure[0].name, { data: structure[1].name })

		assert.strictEqual(result, data.key)

	})

	it('should load Sightly and transform it to optimized HTML when optimization enabled', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.htl`,
				contents: '${environment}'
			}
		])

		const result = await index(structure[0].name, { optimize: true })

		assert.strictEqual(result, 'prod')

	})

	it('should load Sightly and transform it to HTML with custom data from a JS data file', async function() {

		const fileName = uuid()
		const data = { key: 'value' }

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ fileName }.htl`,
				contents: '${key}'
			},
			{
				type: fsify.FILE,
				name: `${ fileName }.data.js`,
				contents: `module.exports = ${ JSON.stringify(data) }`
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, data.key)

	})

	it('should load Sightly and transform it to HTML with custom data from a JSON data file', async function() {

		const fileName = uuid()
		const data = { key: 'value' }

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ fileName }.htl`,
				contents: '${key}'
			},
			{
				type: fsify.FILE,
				name: `${ fileName }.data.json`,
				contents: JSON.stringify(data)
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, data.key)

	})

	describe('.in()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.in(), '.htl')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.in(''), '.htl')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.in({ in: '.xml' }), '.xml')

		})

	})

	describe('.out()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.out(), '.html')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.out(''), '.html')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.out({ out: '.xml' }), '.xml')

		})

	})

	describe('.cache', function() {

		it('should be an array', function() {

			assert.isArray(index.cache)

		})

	})

})