require('../models/TestScript');

var mongoose = require('mongoose');
var TestScript = mongoose.model('TestScript');
var moment = require('moment');
moment().utcOffset(8);

module.exports = {
	scriptId: function (req, res, next, id) {
	  TestScript.findById(id).exec(function (err, script){
	    if (err) { return next(err); }
	    if (!script) { return next(new Error("can't find script")); }

	    req.testscript = script;
	    return next();
	  });
	},
	getScripts: function (req, res, next) {
	    TestScript.find({}, {folder: 1, title: 1, type: 1, date: 1}, function(err, scripts){
	      if(err){ return next(err); }

	      res.json(scripts);
	    });
	},
	getScriptById: function (req, res, next) {
	    res.json(req.testscript);
	},
	updateScript: function (req, res, next) {
      req.testscript.content = req.body.content;
      req.testscript.title = req.body.title;
      req.testscript.type = req.body.type;
      req.testscript.folder = req.body.folder;
      req.testscript.date = moment();

      req.testscript.save(function(err, script){
        if(err){ return next(err); }
        res.json(script);
      });
	},
	newScript: function (req, res, next) {
	    req.body.date = moment();
	    var script = new TestScript(req.body);

	    script.save(function(err, script){
	      if(err){ return next(err); }
	      res.json(script);
	    });
	},
	deleteScript: function (req, res, next) {
	  req.testscript.remove(function(err, script){
	    if (err) { return next(err); }

	    res.json(script);
	  });
	}
};