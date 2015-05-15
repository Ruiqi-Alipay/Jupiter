var path = require('path'),
	ApiUtils = require('./api-utils'),
	Package = require(path.join(__dirname, '..', 'mongodb', 'package'));

module.exports = function (req, res, next) {
	Package.find(function(err, packages){
		if (err) {
			return res.json({
				success: false,
				data: err.toString()
			});
		}

		res.json({
			success: true,
			data: ApiUtils.toClientPackage(packages)
		});
	});
};