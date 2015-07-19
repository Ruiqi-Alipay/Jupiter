var path = require('path'),
	Script = require(path.join(__dirname, '..', 'mongodb', 'script')),
	ApiUtils = require('./api-utils');

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Script.find({ username: user.username, folder: req.params.folder_id }, {folder: 1, title: 1, type: 1, date: 1})
				.sort('-date').exec(function (err, scripts) {
			if (err) {
				return res.json({ success: false });
			}

			res.json({
				success: true,
				data: ApiUtils.toClientScript(scripts)
			});
		});
	});
};