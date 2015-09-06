var bcrypt = require('bcryptjs'),
	User = require('../mongodb/user.js');

module.exports = function (req, res, next) {
	var body = req.body;
	if (!body || !body.username || !body.password) {
		return res.json({
			success: false,
			data: 'request format not currect!'
		});
	}

	var salt = bcrypt.genSaltSync(10);
	body.password = bcrypt.hashSync(body.password, salt);

	var newUser = new User(body);
	newUser.save(function (err, user) {
		if (err || !user) {
			return res.json({
				success: false,
				data: 'username already taken'
			});
		}

		return res.json({
			success: true
		});
	});
};