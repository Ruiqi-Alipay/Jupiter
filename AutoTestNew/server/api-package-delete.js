var path = require('path'),
	fs = require('fs-extra'),
	ApiUtils = require('./api-utils'),
	Package = require(path.join(__dirname, '..', 'mongodb', 'package'));

module.exports = function (req, res, next) {
	Package.findOneAndRemove({ _id: req.params.package_id }, function(err, deletePackage){
		if (err) {
			return res.json({
				success: false,
				data: err.toString()
			});
		}
		fs.remove(path.join(__dirname, '..', 'public', deletePackage.name));
		res.json({
			success: true,
			data: ApiUtils.toClientPackageSingle(deletePackage)
		});
	});
};