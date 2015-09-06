var bcrypt = require('bcryptjs'),
	User = require('../mongodb/user.js'),
	uuid = require('node-uuid');

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		user.sessionId = '';
		user.update(function (err, user) {
			if (err) {
				return res.json({
					success: false,
					data: 'user update failed'
				});
			}

			return res.json({
				success: true
			});
		});
	});
};