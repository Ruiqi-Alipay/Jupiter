var path = require('path'),
	ApiUtils = require('./api-utils'),
    Parameter = require(path.join(__dirname, '..', 'mongodb', 'parameter'));

module.exports = function (req, res, next) {
	var parameter = new Parameter(req.body);
	parameter.save(function(err, parameter){
		if (err) {
			return res.json({
				success: false,
				data: err.toString()
			});
		}

		res.json({
			success: true,
			data: ApiUtils.toClientParameterSingle(parameter)
		});
	});
};