require('../models/SDKProtocol');

var mongoose = require('mongoose');
var SDKProtocol = mongoose.model('SDKProtocol');

module.exports = {
	protocolId: function (req, res, next, protocolId) {
	  SDKProtocol.findById(protocolId).exec(function (err, protocol){
	    if (err) { return next(err); }
	    if (!protocol) { return next(new Error("can't find protocol")); }

	    req.protocol = protocol;
	    return next();
	  });
	},
	getProtocol: function (req, res, next) {
	  SDKProtocol.find(function(err, protocol){
	    if(err || protocol.length == 0){ return next(err); }

	    res.json(protocol[0]);
	  });
	},
	updateProtocol: function (req, res, next) {
        req.protocol.content = req.body.content;
        req.protocol.save(function(err, script){
          if(err){ return next(err); }
          res.json(script);
        });
	},
	newProtocol: function (req, res, next) {
      var protocol = new SDKProtocol(req.body);
      protocol.save(function(err, script){
        if(err){ return next(err); }
        res.json(script);
      });
	},
	deleteProtocol: function (req, res, next) {
	  req.protocol.remove(function(err, protocol){
	    if (err) { return next(err); }

	    res.json(protocol);
	  });
	}
};