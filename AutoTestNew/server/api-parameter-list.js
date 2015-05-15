var path = require('path'),
	ApiUtils = require('./api-utils'),
    Parameter = require(path.join(__dirname, '..', 'mongodb', 'parameter'));

module.exports = function (req, res, next) {
	Parameter.find().sort('name').exec(function(err, parameters){
		if (err) {
			return res.json({
				success: false,
				data: err.toString()
			});
		}

		res.json({
			success: true,
			data: ApiUtils.toClientParameter(parameters)
		});
	});
};