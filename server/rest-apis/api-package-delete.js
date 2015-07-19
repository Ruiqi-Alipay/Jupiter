var path = require('path'),
	fs = require('fs-extra'),
	ApiUtils = require('./api-utils'),
	Package = require(path.join(__dirname, '..', 'mongodb', 'package'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Package.findOneAndRemove({ _id: req.params.package_id, username: req.query.username }, function(err, deletePackage){
			if (err || !deletePackage) {
				return res.json({
					success: false,
					data: err.toString()
				});
			}

			fs.remove(path.join(__dirname, '..', 'uploads', req.query.username, deletePackage.name));
			res.json({
				success: true,
				data: ApiUtils.toClientPackageSingle(deletePackage)
			});
		});
	});
};