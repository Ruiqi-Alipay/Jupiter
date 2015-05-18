var targz = require('tar.gz'),
    fs = require('fs-extra'),
    path = require('path'),
    ApiUtils = require('./api-utils'),
    moment = require('moment'),
    Report = require(path.join(__dirname, '..', 'mongodb', 'report'));

module.exports = function (req, res, next) {
    if (!req.files || !req.files.file) {
        return res.json({ success: false }); 
    }

    var file = req.files.file;
    if (!fs.existsSync(file.path)) {
        return res.json({ success: false });
    }

    new targz().extract(file.path, path.join(__dirname, '..', 'reports', file.name), function(err){
  	    if (fs.existsSync(file.path)) {
  	  	    fs.remove(file.path);
  	  	}

        if (err) {
            return res.json({ success: false });
        }

        fs.readFile(path.join(__dirname, '..', 'reports', file.name, 'performance.report'), function(err, data) {
            if (err) {
                return res.json({ success: false });
            }

            var records = JSON.parse(data);
            records.forEach(function(value, index) {
                delete value['data'];
            });

            var report = new Report();
            report.title = file.name;
            report.content = JSON.stringify(records);
            report.date = moment();
            report.save(function(err, report){
                if (err) {
                  return res.json({ success: false });
                }

                res.json({
                    success: true,
                    data: ApiUtils.toClientReportSingle(report)
                });
            });
        });
    });
};