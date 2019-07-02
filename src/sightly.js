'use strict'

const sightly = require('@adobe/htlengine/src/main')

/**
 * Transform Sightly to HTML.
 * @public
 * @param {String} template - Path to the Sightly/HTL file being rendered.
 * @param {Object} resource - JSON data used to render the file.
 * @returns {Promise<String>} HTML.
 */

module.exports = async function(template, resource) {

	const res = await sightly(resource, template)

	return res

}