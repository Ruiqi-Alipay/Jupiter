require('../models/ScriptParameter');

var mongoose = require('mongoose');
var ScriptParameter = mongoose.model('ScriptParameter');

module.exports = {
	prameterId: function (req, res, next, id) {
	  ScriptParameter.findById(id).exec(function (err, param){
	    if (err) { return next(err); }
	    if (!param) { return next(new Error("can't find param")); }

	    req.scriptparameter = param;
	    return next();
	  });
	},
	getPrameters: function (req, res, next) {
	  ScriptParameter.find(function(err, params){
	    if(err){ return next(err); }

	    res.json(params);
	  });
	},
	newPrameter: function (req, res, next) {
	    ScriptParameter.find({name: req.body.name}, function(err, param) {
	      if (param.length > 0) {
	          res.json({error: 'name already exit!', object: param});
	      } else {
	        var newItem = new ScriptParameter(req.body);
	        newItem.save(function(err, item){
	          if(err){ return next(err); }
	          res.json(item);
	        });
	      }
	    });
	},
	updatePrameter: function (req, res, next) {
      req.scriptparameter.name = req.body.name;
      req.scriptparameter.value = req.body.value;

      req.scriptparameter.save(function(err, value){
        if(err){ return next(err); }
        res.json(value);
      });
	},
	deletePrameter: function (req, res, next) {
	  req.scriptparameter.remove(function(err, param){
	    if (err) { return next(err); }

	    res.json(param);
	  });
	}
};