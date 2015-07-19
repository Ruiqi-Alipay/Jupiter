var path = require('path'),
	User = require('../mongodb/user'),
    Folder = require('../mongodb/folder'),
    ApiUtils = require('./api-utils');

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Folder.find({ username: user.username }).sort('title').exec(function(err, folders){
			if (err) {
				return res.json({
					success: false,
					data: 'list folder failed'
				});
			}

			res.json({
				success: true,
				data: ApiUtils.toClientFolder(folders)
			});
		});
	});
};