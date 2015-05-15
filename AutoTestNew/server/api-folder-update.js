var path = require('path'),
    Folder = require(path.join(__dirname, '..', 'mongodb', 'folder')),
    ApiUtils = require('./api-utils');

module.exports = function (req, res, next) {
	Folder.findOneAndUpdate({ _id: req.params.folder_id }, req.body, { 'new': true }, function(err, folder){
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