var path = require('path'),
	ApiUtils = require('./api-utils'),
	User = require('../mongodb/user'),
    Folder = require(path.join(__dirname, '..', 'mongodb', 'folder'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Folder.findOneAndRemove({ _id: req.params.folder_id, username: user.username }, function(err, folder){
			if (err || !folder) {
				return res.json({
					success: false,
					data: err.toString()
				});
			}

			res.json({
				success: true,
				data: ApiUtils.toClientFolderSingle(folder)
			});
		});
	});
};