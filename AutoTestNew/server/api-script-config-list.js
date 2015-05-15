var path = require('path'),
	Script = require(path.join(__dirname, '..', 'mongodb', 'script')),
	Folder = require(path.join(__dirname, '..', 'mongodb', 'folder')),
	apiUtils = require('./api-utils');

module.exports = function (req, res, next) {

	Folder.find(function (err, folders) {
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
					configScripts: apiUtils.toClientScript(scripts),
					folders: apiUtils.toClientFolder(folders)
				}
			});
		});
	});
};