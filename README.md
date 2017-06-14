# sb-validatejson - Starbound mod helper

sb-validatejson is a node.js utility designed to assist with quickly validating the syntax of the JSON files that Starbound (and Starbound mods) use.
This is slightly different due to Starbound's use of comments inside of JSON files; they have to be stripped before typical JSON validation.

## installation

Install the latest version of node.js, then:

    npm install damianb/sb-validatejson

Then, create a small stub file (of your own naming) to call the module.

## usage

Just call the exported function - see the example below.

	let validator = require('sb-validatejson')
	validator({
		modDir: 'D:\\code\\starbound\\sbmods\\AsteroidOres\\src',
	}, function(errors) {
		if(errors) {
			errors.forEach(function(err) {
				console.error(err.stack)
			})
			process.exit(1)
		}
	})

The only arguments taken by the module's function are as follows:

* **options**: a javascript object with any of the following properties:
* *options.modDir*: the filesystem location where your mod's files live (basically where the _metadata file is).


* **callback**: a javascript callback to receive any JSON parsing errors discovered when validating the mod's JSON files.  Will only receive one argument, which is be an array of any errors encountered.

And that's it!  Run the js, and you'll get information on any invalid JSON files in your mod.

## todo

CLI utility for verifying everything in current directory.  Would be massively helpful.