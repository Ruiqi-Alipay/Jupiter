var bcrypt = require('bcryptjs'),
	ApiUtils = require('./api-utils'),
	User = require('../mongodb/user.js');

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		user.remove(function (err, user) {
			if (err) {
				return res.json({
					success: false,
					data: 'user not found'
				});
			}

			return res.json({
				success: true
			});
		});
	});
};