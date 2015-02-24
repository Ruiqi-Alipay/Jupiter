require('../models/TestScriptFolder');

var mongoose = require('mongoose');
var TestScriptFolder = mongoose.model('TestScriptFolder');

module.exports = {
	folderId: function(req, res, next, id) {
	  TestScriptFolder.findById(id).exec(function (err, folder){
	    if (err) { return next(err); }
	    if (!folder) { return next(new Error("can't find folder")); }

	    req.testscriptfolder = folder;
	    return next();
	  });
	},
	getFolders: function (req, res, next) {
	  TestScriptFolder.find(function(err, folders){
	    if(err){ return next(err); }

	    res.json(folders);
	  });
	},
	newFolder: function (req, res, next) {
	    var folder = new TestScriptFolder(req.body);

	    folder.save(function(err, folder){
	      if(err){ return next(err); }
	      res.json(folder);
	    });
	},
	updateFolder: function(req, res, next) {
      req.testscriptfolder.title = req.body.title;

      req.testscriptfolder.save(function(err, folder){
        if(err){ return next(err); }
        res.json(folder);
      });
	},
	deleteFolder: function (req, res, next) {
	  req.testscriptfolder.remove(function(err, folder){
	    if (err) { return next(err); }

	    res.json(folder);
	  });
	}
};