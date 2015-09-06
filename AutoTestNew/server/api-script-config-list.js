var path = require('path'),
	Script = require(path.join(__dirname, '..', 'mongodb', 'script')),
	Folder = require(path.join(__dirname, '..', 'mongodb', 'folder')),
	ApiUtils = require('./api-utils');

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Folder.find({ username: user.username }, function (err, folders) {
			if (err) {
				return res.json({ success: false });
			}

			Script.find({ type: 'Config' }, {title: 1, type: 1, date: 1})
					.sort('-date').exec(function (err, scripts) {
				if (err) {
					return res.json({ success: false });
				}

				res.json({
					success: true,
					data: {
						configScripts: ApiUtils.toClientScript(scripts),
						folders: ApiUtils.toClientFolder(folders)
					}
				});
			});
		});
	});
};