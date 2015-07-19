var path = require('path'),
	ApiUtils = require('./api-utils'),
	User = require('../mongodb/user'),
    Folder = require(path.join(__dirname, '..', 'mongodb', 'folder'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		console.log(req.body);
		
	    var folder = new Folder(req.body);
	    folder.username = user.username;
	    folder.save(function(err, folder){
			if (err) {
				return res.json({
					success: false,
					data: err
				});
			}

			res.json({
				success: true,
				data: ApiUtils.toClientFolderSingle(folder)
			});
	    });
	});
};