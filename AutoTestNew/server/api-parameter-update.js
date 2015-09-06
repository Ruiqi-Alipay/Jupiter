var path = require('path'),
	ApiUtils = require('./api-utils'),
    Parameter = require(path.join(__dirname, '..', 'mongodb', 'parameter'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Parameter.findOneAndUpdate({ _id: req.params.parameter_id, username: user.username }, { value: req.body.value }, { 'new': true }, function(err, parameter){
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
	});
};