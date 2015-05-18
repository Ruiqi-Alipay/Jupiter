var path = require('path'),
	ApiUtils = require('./api-utils'),
	Package = require(path.join(__dirname, '..', 'mongodb', 'package'));

module.exports = function (req, res, next) {
	var platform = req.param('platform');
	Package.find(platform ? {'type': platform} : undefined, function(err, items){
		if(err){ return next(err); }

		res.json(items);
	});
};