var path = require('path'),
    Folder = require(path.join(__dirname, '..', 'mongodb', 'folder')),
    ApiUtils = require('./api-utils');

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Folder.findOneAndUpdate({ _id: req.params.folder_id, username: user.username }, req.body, { 'new': true }, function(err, folder){
			if (err) {
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