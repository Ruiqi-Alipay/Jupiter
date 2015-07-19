var fs = require('fs'),
	path = require('path');

module.exports = function (req, res, next) {
	fs.readFile(path.join(__dirname, '..', 'environment', 'platform.json'), function(err, data) {
		if (err) {
			return res.json({
				success: false,
				data: err.toString()
			});
		}

		var data;
		try {
			data = JSON.parse(data);
		} catch (err) {
		}

		res.json({
			success: true,
			data: data
		});
	});
};