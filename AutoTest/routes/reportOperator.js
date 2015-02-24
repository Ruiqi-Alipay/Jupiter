require('../models/TestReport');

var mongoose = require('mongoose');
var TestReport = mongoose.model('TestReport');
var fs = require('fs-extra')

module.exports = {
	reportId: function (req, res, next, id) {
	  TestReport.findById(id).exec(function (err, report){
	    if (err) { return next(err); }
	    if (!report) { return next(new Error("can't find report")); }

	    req.testreport = report;
	    return next();
	  });
	},
	getReports: function (req, res, next) {
	  if (req.query && req.query.title) {
	    TestReport.find({title: decodeURIComponent(req.query.title)}, function(err, report){
	      if(err){ return next(err); }

	      res.json(report);
	    });
	  } else {
	    var query = TestReport.find({}, {date: 1, title: 1}).sort({ date: -1 });

	    query.exec(function(err, reports){
	      if(err){ return next(err); }

	      res.json(reports);
	    });
	  }
	},
	newReport: function (req, res, next) {
	  try {
	    var file = req.files.file;

	    console.log('uplaoding:');

	    var compress = new targz().extract(file.path, './reports/' + file.name, function(err){
	        if(err) {
	          console.log(err);
	          return next(err);
	        }

	        fs.readFile('./reports/' + file.name + '/performance.report', function(err, data) {
	          if (err) {
	            console.log(err);
	            return next(err);
	          } else {
	            try {
	              var records = JSON.parse(data);
	              records.forEach(function(value, index) {
	                delete value['data'];
	              });

	              var report = new TestReport();
	              report.title = file.name;
	              report.content = JSON.stringify(records);
	              report.date = moment();
	              report.save(function(err, report){
	                if(err){
	                  console.log('Report save error: ' + err);
	                  return next(err);
	                } else {
	                  res.json(report);
	                }
	              });
	            } catch (err) {
	              return next(err);
	            }
	          }
	         });
	     });
	  } catch (err) {
	    return next(err);
	  }
	},
	deleteReport: function (req, res, next) {
	  fs.remove('uploads/' + req.testreport.title, function(err) {
	    if (err) return console.error(err)

	    console.log("Delete source gz success")
	  });
	  fs.remove('reports/' + req.testreport.title, function(err) {
	    if (err) return console.error(err)

	    console.log("Delete extracted content success")
	  })
	  req.testreport.remove(function(err, report){
	    if (err) { return next(err); }

	    res.json(report);
	  });
	},
	getReportData: function (req, res, next) {
	  var file = decodeURIComponent(req.query.file);
	  var index = req.query.index;

	  fs.readFile('./reports/' + file + '/performance.report', function(err, data) {
	    if (err) { return next(err); }

	    var report = JSON.parse(data);
	    res.json(report[index].data);
	  });
	}
};