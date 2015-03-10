require('../models/TestApp');

var mongoose = require('mongoose');
var fs = require('fs-extra')
var path = require('path');
var TestApp = mongoose.model('TestApp');

module.exports = {
	appId: function (req, res, next, appId) {
	  TestApp.findById(appId).exec(function (err, item){
	    if (err) { return next(err); }
	    if (!item) { return next(new Error("can't find item")); }

	    req.app = item;
	    return next();
	  });
	},
	newApp: function (req, res, next) {
	    var file = req.files.file;
	    var newItem = new TestApp();
	    newItem.name = file.name;
	    newItem.path = '/uploads/' + file.name;

	    var data = JSON.parse(req.body.data);
	    newItem.type = data.type;
	    newItem.description = data.description;
	    newItem.save(function(err, item){
	      if(err){ return next(err); }
	      res.json(item);
	    });
	},
	getApps: function (req, res, next) {
	  var platform = req.param('platform');
	  TestApp.find(platform ? {'type': platform} : undefined, function(err, items){
	    if(err){ return next(err); }

	    res.json(items);
	  });
	},
	deleteApp: function (req, res, next) {
	  fs.remove(path.join(__dirname, '..', 'uploads', req.app.name), function(err) {
	    if (err) return console.error(err)

	    console.log("Delete apk success")
	  });
	  req.app.remove(function(err, item){
	    if (err) { return next(err); }

	    res.json(item);
	  });
	}
};