var path = require('path'),
	ApiUtils = require('./api-utils'),
	monent = require('moment'),
	fs = require('fs-extra'),
	Package = require(path.join(__dirname, '..', 'mongodb', 'package'));

module.exports = function (req, res, next) {
			console.log(req.files);
		console.log(req.body);
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		var query = req.query;
		if (!req.files || !req.files.file || !query.description || !query.type) {
			return res.json({
				success: false,
				data: 'error request'
			});
		}

		var file = req.files.file;
		if (!fs.existsSync(file.path)) {
			return res.json({
				success: false,
				data: 'file upload failed'
			});
		}

		try {
			var userDir = path.join(__dirname, '..', 'uploads', user.username);
			if (!fs.existsSync(userDir)) {
				fs.mkdirSync(userDir);
			}
			fs.copySync(file.path, path.join(userDir, file.name));
		} catch (err) {
			return res.json({
				success: false,
				data: 'file uperate excaption: ' + err.toString()
			});
		}

		var newPackage = new Package();
		newPackage.username = user.username;
		newPackage.name = file.name;
		newPackage.path = '/uploads/' + user.username + '/' + file.name;
		newPackage.type = query.type;
		newPackage.description = decodeURIComponent(query.description);
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
	});
};