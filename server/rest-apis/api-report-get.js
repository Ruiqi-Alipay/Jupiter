var path = require('path'),
	fs = require('fs-extra'),
	ApiUtils = require('./api-utils'),
	Report = require(path.join(__dirname, '..', 'mongodb', 'report'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Report.findOne({ _id: req.params.report_id, username: user.username }, function (err, report) {
			if (err) {
				return res.json({ success: false });
			}

			var index = req.query.index;

			fs.readFile(path.join(__dirname, '..', 'public', report.title, performance.report), function(err, data) {
				if (err) {
					return res.json({ success: false });
				}

				var report = JSON.parse(data);
				
				res.json({ success: true, data: report[index].data });
			});
		});
	});
};