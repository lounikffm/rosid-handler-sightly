'use strict'

const sightly = require('@adobe/htlengine/src/main')

/**
 * Transform Sightly/HTL to HTML.
 * @public
 * @param {String} template - Path to the Sightly/HTL file being rendered.
 * @param {Object} resource - JSON data used to render the file.
 * @returns {Promise<String>} HTML.
 */

module.exports = async function (template, resource, opts) {

	return sightly(resource, `
		${ typeof opts.prepend === 'string' ? opts.prepend : ''}
		${ template}
		${ typeof opts.append === 'string' ? opts.append : ''}
	`)

}