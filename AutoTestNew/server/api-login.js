
module.exports = function (req, res, next) {
	var body = req.body;
	if (!body) {
		return res.json({
			success: false
		});
	}

	if ((body.username == 'yuhe' && body.password == 'yuhe123')
		|| (body.username == 'wb-zhongc' && body.password == '123')) {
		return res.json({
			success: true,
			token: 'FRAKETOKEN'
		});
	} else {
		return res.json({
			success: false
		});
	}
};