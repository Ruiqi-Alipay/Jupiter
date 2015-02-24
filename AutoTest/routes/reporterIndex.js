var express = require('express');
var fs = require('fs');
var router = express.Router();

var mongoose = require('mongoose');
var TestReport = mongoose.model('TestReport');

router.get('/api/testreport', function(req, res, next) {
  if (req.query && req.query.title) {
    TestReport.find({title: decodeURIComponent(req.query.title)}, function(err, report){
      if(err){ return next(err); }

      res.json(report);
    });
  } else {
    TestReport.find(function(err, reports){
      if(err){ return next(err); }

      res.json(reports);
    });
  }
});

router.get('/api/reportdata', function(req, res, next) {
  var file = decodeURIComponent(req.query.file);
  var index = req.query.index;

  fs.readFile('./reports/' + file + '/performance.report', function(err, data) {
    if (err) { return next(err); }

    var report = JSON.parse(data);
    res.json(report[index].data);
  });
});

module.exports = router;