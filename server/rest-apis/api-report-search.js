var path = require('path'),
	ApiUtils = require('./api-utils'),
	Report = require(path.join(__dirname, '..', 'mongodb', 'report'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		var search = req.query.search;
		if (!search) {
			return res.json({ success: false });
		}

		Report.find({ username: user.username, title: new RegExp('.*' + search + '.*')}, {date: 1, title: 1}).sort('-date').limit(10).exec(function (err, reports) {
			if (err) {
				return res.json({ success: false });
			}

			res.json({
				success: true,
				data: ApiUtils.toClientReport(reports)
			});
		});
	});
};