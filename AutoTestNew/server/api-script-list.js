var path = require('path'),
	Script = require(path.join(__dirname, '..', 'mongodb', 'script')),
	apiUtils = require('./api-utils');

module.exports = function (req, res, next) {
	Script.find({ folder: req.params.folder_id }, {folder: 1, title: 1, type: 1, date: 1})
			.sort('-date').exec(function (err, scripts) {
		if (err) {
			return res.json({ success: false });
		}

		res.json({
			success: true,
			data: apiUtils.toClientScript(scripts)
		});
	});
};