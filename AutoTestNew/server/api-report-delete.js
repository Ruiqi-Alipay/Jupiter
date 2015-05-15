var path = require('path'),
	fs = require('fs-extra'),
	Report = require(path.join(__dirname, '..', 'mongodb', 'report'));

module.exports = function (req, res, next) {
	Report.findOneAndRemove({ _id: req.params.report_id }, function(err, report){
		if (err) {
			return res.json({ success: false });
		}

		fs.remove(path.join(__dirname, '..', 'public', report.title));
        res.json({
            success: true,
            data: ApiUtils.toClientReportSingle(report)
        });
	});
};