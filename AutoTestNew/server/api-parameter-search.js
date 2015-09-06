var path = require('path'),
	ApiUtils = require('./api-utils'),
	Parameter = require(path.join(__dirname, '..', 'mongodb', 'parameter'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		var search = req.query.search;
		if (!search) {
			return res.json({ success: false });
		}

		Parameter.find(
			{ username: user.username , $or: [{'name': new RegExp('.*' + search + '.*')}, {'value': new RegExp('.*' + search + '.*')}] })
			.sort('name').limit(10).exec(function (err, parameters) {
			if (err) {
				return res.json({ success: false });
			}

			res.json({
				success: true,
				data: ApiUtils.toClientParameter(parameters)
			});
		});
	});
};