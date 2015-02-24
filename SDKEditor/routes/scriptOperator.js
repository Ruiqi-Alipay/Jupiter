require('../models/Scripts');

var mongoose = require('mongoose');
var Script = mongoose.model('Script');

module.exports = {
	scriptId: function (req, res, next, scriptId) {
	  Script.findById(scriptId).exec(function (err, script){
	    if (err) { return next(err); }
	    if (!script) { return next(new Error("can't find script")); }

	    req.script = script;
	    return next();
	  });
	},
	getScripts: function (req, res, next) {
	    Script.find({}, {title: 1, date: 1, folder: 1}, function(err, scripts){
	      if(err){ return next(err); }

	      res.json(scripts);
	    });
	},
	getScriptById: function (req, res, next) {
	    Script.findById(req.query.id).exec(function (err, script){
	      if (err) { return next(err); }
	      res.json(script);
	    });
	},
	updateScript: function (req, res, next) {
	    req.script.title = req.body.title;
	    req.script.content = req.body.content;
	    req.script.date = new Date();
	    req.script.folder = req.body.folder;

	    req.script.save(function(err, script){
	      if(err){ return next(err); }
	      res.json(script);
	    });
	},
	newScript: function (req, res, next) {
      var script = new Script(req.body);
      script.save(function(err, script){
        if(err){ return next(err); }
        res.json(script);
      });
	},
	deleteScript: function (req, res, next) {
	  req.script.remove(function(err, script){
	    if (err) { return next(err); }

	    res.json(script);
	  });
	}
};