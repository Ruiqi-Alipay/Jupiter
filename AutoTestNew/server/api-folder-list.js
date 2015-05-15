var path = require('path'),
    Folder = require(path.join(__dirname, '..', 'mongodb', 'folder')),
    ApiUtils = require('./api-utils');

module.exports = function (req, res, next) {
	Folder.find().sort('title').exec(function(err, folders){
		if (err) {
			return res.json({
				success: false,
				data: err.toString()
			});
		}

		res.json({
			success: true,
			data: ApiUtils.toClientFolder(folders)
		});
	});
};