var path = require('path'),
	ApiUtils = require('./api-utils'),
	monent = require('moment'),
	Package = require(path.join(__dirname, '..', 'mongodb', 'package'));

module.exports = function (req, res, next) {
	if (!req.files || !req.files.file || !req.query.type || !req.query.description) {
		return res.json({
			success: false,
			data: 'error request'
		});
	}

	var file = req.files.file,
		type = decodeURIComponent(req.query.type),
		description = decodeURIComponent(req.query.description);

	var newPackage = new Package();
	newPackage.name = file.name;
	newPackage.path = '/public/' + file.name;
	newPackage.type = type;
	newPackage.description = description;
	newPackage.date = monent();

	newPackage.save(function(err, newPackage){
		if (err) {
			return res.json({
				success: false,
				data: err.toString()
			});
		}

		res.json({
			success: true,
			data: ApiUtils.toClientPackageSingle(newPackage)
		});
	});
};