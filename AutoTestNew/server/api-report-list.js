var path = require('path'),
	ApiUtils = require('./api-utils'),
	Report = require(path.join(__dirname, '..', 'mongodb', 'report'));

module.exports = function (req, res, next) {
	Report.count(function (err, count) {
		if (err) {
			return res.json({ success: false });
		}

		var totalPage = count / 10 + (count % 10 > 0 ? 1 : 0);
		var page = req.query.page ? req.query.page : 0;

		if (page >= totalPage) {
			return res.json({ success: false });
		}

		var skip = page * 10;

		Report.find(null, {date: 1, title: 1}).sort('-date').skip(skip).limit(10).exec(function (err, reports) {
			if (err) {
				return res.json({ success: false });
			}

			res.json({
				success: true,
				data: {
					reports: ApiUtils.toClientReport(reports),
					totalPage: totalPage,
					currentPage: page
				}
			});
		});
	});
};