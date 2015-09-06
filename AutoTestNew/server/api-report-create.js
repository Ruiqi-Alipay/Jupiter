var targz = require('tar.gz'),
    fs = require('fs-extra'),
    path = require('path'),
    moment = require('moment'),
    Report = require(path.join(__dirname, '..', 'mongodb', 'report'));

module.exports = function (req, res, next) {
    if (!req.files || !req.files.reportZip
            || !req.body || !req.body.report) {
        return res.json({
            success: false,
            data: 'illegal uplaod request'
        });
    }

    var file = req.files.reportZip;
    if (!fs.existsSync(file.path)) {
        return res.json({
            success: false,
            data: 'upload file not found'
        });
    }

    var report = JSON.parse(req.body.report);
    if (!report.username || !report.title) {
        return res.json({
            success: false,
            data: 'report format not correct'
        });
    }

    // TODO: refine this code
    var rootDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir);
    }
    var userDir = path.join(rootDir, report.username);
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
    }
    var reprotDir = path.join(userDir, report.title);
    if (!fs.existsSync(reprotDir)) {
        fs.mkdirSync(reprotDir);
    }

    new targz().extract(file.path, reprotDir, function(err){
  	    if (fs.existsSync(file.path)) {
  	  	    fs.remove(file.path);
  	  	}

        if (err) {
            if (fs.existsSync(reprotDir)) {
                fs.remove(reprotDir);
            }
            return res.json({ success: false });
        }

        var dbReport = new Report();
        dbReport.title = report.title;
        dbReport.username = report.username;
        dbReport.content = JSON.stringify(report.items);
        dbReport.date = moment();
        dbReport.save(function(err, report){
            if (err) {
                if (fs.existsSync(reprotDir)) {
                    fs.remove(reprotDir);
                }
                return res.json({
                    success: false,
                    data: 'save report failed: ' + err.toString()
                });
            }

            res.json({
                success: true
            });
        });
    });
};