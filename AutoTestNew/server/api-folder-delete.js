var path = require('path'),
	ApiUtils = require('./api-utils'),
    Folder = require(path.join(__dirname, '..', 'mongodb', 'folder'));

module.exports = function (req, res, next) {
	Folder.findOneAndRemove({ _id: req.params.folder_id }, function(err, folder){
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
};