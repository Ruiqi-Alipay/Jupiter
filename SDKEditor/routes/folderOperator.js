require('../models/ScriptsFolder');

var mongoose = require('mongoose');
var ScriptsFolder = mongoose.model('ScriptsFolder')

module.exports = {
	folderId: function (req, res, next, folderId) {
	  ScriptsFolder.findById(folderId).exec(function (err, folder){
	    if (err) { return next(err); }
	    if (!folder) { return next(new Error("can't find folder")); }

	    req.folder = folder;
	    return next();
	  });
	},
	getFolders: function (req, res, next) {
	  ScriptsFolder.find(function(err, folders){
	    if(err){ return next(err); }

	    res.json(folders);
	  });
	},
	updateFolder: function (req, res, next) {
      req.folder.title = req.body.title;

      req.folder.save(function(err, folder){
        if(err){ return next(err); }
        res.json(folder);
      });
	},
	newFolder: function (req, res, next) {
	    var folder = new ScriptsFolder(req.body);
	    folder.save(function(err, folder){
	      if(err){ return next(err); }
	      res.json(folder);
	    });
	},
	deleteFolder: function (req, res, next) {
	  req.folder.remove(function(err, folder){
	    if (err) { return next(err); }

	    res.json(folder);
	  });
	}
};