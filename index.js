//
// sb-validatejson - Starbound mod helper - JSON file validation
// ---
// @copyright (c) 2017 Damian Bushong <katana@odios.us>
// @license MIT license
// @url <https://github.com/damianb/>
// @reddit <https://reddit.com/u/katana__>
//
/*jslint node: true, asi: true */
"use strict"

let r_readdir = require('recursive-readdir')
let jsonlint = require('jsonlint')
let stripComments = require('strip-json-comments')
let path = require('path')
let fs = require('fs-extra')
let os = require('os')

module.exports = function(options, callback) {
	if(!options.modDir) {
		throw new Error('mod source directory MUST be specified')
	}

	options.modDir += path.sep

	// these should let us ignore files that can't be JSON-patched.
	let ignoredFiles = [
		// .disabled and .objectdisabled exist in the Starbound asset files
		//   we're ignoring them for now, because we probably shouldn't care about these files
		'*.disabled', // ignored for now. @todo: reconsider?
		'*.objectdisabled',  // ignored for now. @todo: reconsider?
		'*.ase', // no idea why an ASE file is in the Starbound assets...lol Chucklefish.
		'*.md',
		'*.png',
		'*.PNG',
		'*.wav',
		'*.ogg',
		'*.ttf',
		'*.lua',
		'*.txt',
		'*.psd',
		'*.pdn',
		'*.broken',
		'*.db',
		'_metadata',
		'.metadata',
		'.gitignore',
		'.git',
		'_previewimage'
	]

	r_readdir(options.modDir, ignoredFiles, function(err, files) {
		if(err) throw err

		let errors = []
		files.forEach(function(filePath) {
			// sanity check
			if(!filePath.startsWith(options.modDir)) {
				return
			}

			let json = null
			let originalJson = stripComments(fs.readFileSync(filePath, "utf8"))
			try {
				// we have to strip comments to deal with Starbound's JSON spec violation of multiline strings
				json = originalJson.replace(/\r?\n|\r/g, '')
				json = jsonlint.parse(json)
			} catch(err) {
				try {
					// rerun it in order to try and get an accurate error message.  yeah it's a terrible solution, but...
					json = jsonlint.parse(originalJson)
				} catch(err) {
					err.message = 'Failed to parse file "' + filePath + '"' + os.EOL + err.message
					errors.push(err)
					return
				}

				// uhhh...idk? \_(O_o)_/
				// we'll swallow the error for now and continue
				//err.message = 'Failed to parse file "' + filePath + '"' + os.EOL + err.message
				//errors.push(err)
				return
			}
		})

		if(errors.length > 0) {
			if(!!callback) {
				callback(errors)
			} else {
				errors.forEach(function(err) {
					let stack = err.stack.replace('^', '!')
					console.error(stack)
				})
				process.exit(1)
			}
		} else {
			if(!!callback) {
				callback()
			} else {
				process.exit(0)
			}
		}
	})
}