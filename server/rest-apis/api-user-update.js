var bcrypt = require('bcryptjs'),
	ApiUtils = require('./api-utils'),
	User = require('../mongodb/user.js');

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		var body = req.body;
		if (!body || !body.oldPassword || !body.newPassword) {
			return res.json({
				success: false,
				data: 'request format not currect!'
			});
		}

		if (bcrypt.compareSync(body.oldPassword, user.password)) {
			var salt = bcrypt.genSaltSync(10);
			user.password = bcrypt.hashSync(body.newPassword, salt);
			user.save(function (err, user) {
				if (err || !user) {
					return res.json({
						success: false,
						data: 'update password failed'
					});
				}

				return res.json({
					success: true
				});
			});
		} else {
			return res.json({
				success: false,
				data: 'password not currect'
			});
		}
	});
};