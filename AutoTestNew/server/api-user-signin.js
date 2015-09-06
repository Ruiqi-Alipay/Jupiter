var bcrypt = require('bcryptjs'),
	User = require('../mongodb/user.js'),
	uuid = require('node-uuid');

module.exports = function (req, res, next) {
	var body = req.body;
	if (!body || !body.username || !body.password) {
		return res.json({
			success: false,
			data: 'request format not currect!'
		});
	}

	User.findOne({ username: body.username }, function (err, user) {
		if (err || !user) {
			return res.json({
				success: false,
				data: 'user not found'
			});
		}

		if (bcrypt.compareSync(body.password, user.password)) {
			user.sessionId = uuid.v4();
			user.save(function (err, user) {
				if (err || !user) {
					return res.json({
						success: false,
						data: 'update session failed'
					});
				}

				return res.json({
					success: true,
					data: {
						username: user.username,
						sessionId: user.sessionId
					}
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