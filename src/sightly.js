'use strict'

const sightly = require('@adobe/htlengine/src/main')

/**
 * Transform Sightly/HTL to HTML.
 * @public
 * @param {String} template - Path to the Sightly/HTL file being rendered.
 * @param {Object} resource - JSON data used to render the file.
 * @returns {Promise<String>} HTML.
 */

module.exports = async function(template, resource, opts) {
	const prepend = await opts.prepend
	const append = await opts.append
	return sightly(resource, `
		${ typeof prepend === 'string' ? prepend : '' }
		${ template }
		${ typeof append === 'string' ? append : '' }
	`)
}