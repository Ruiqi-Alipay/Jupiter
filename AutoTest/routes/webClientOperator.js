var TestScriptFolder = require('../models/TestScriptFolder'),
	TestScript = require('../models/TestScript');

module.exports = {
	getScriptFolders: function (req, res, next) {
	  TestScriptFolder.find().sort('title').exec(function(err, folders){
	    res.json(folders ? folders : []);
	  });
	},
	getScriptsByFolder: function (req, res, next) {
	  TestScript.find({'folder': req.params.folder_id}).sort('title').exec(function(err, scripts){
	    res.json(scripts ? scripts : []);
	  });
	}
};