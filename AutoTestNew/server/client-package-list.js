var path = require('path'),
	Package = require(path.join(__dirname, '..', 'mongodb', 'package'));

module.exports = function (req, res, next) {
	Package.find({ username: req.query.username, type: req.query.platform }, function(err, packages){
		if (err) {
			return res.json({
				success: false,
				data: err.toString()
			});
		}

		var results = [];
		var host = 'http://' + req.headers.host + req.baseUrl.slice(0, req.baseUrl.lastIndexOf('/api'));
		if (packages) {
			packages.forEach(function (item) {
				results.push({
					title: item.name + ' (' + item.description + ')',
					download: host + item.path.replace('public', 'uploads')
				});
			});
		}

		res.json({
			success: true,
			data: results
		});
	});
};