var mongoose = require('mongoose');

var ReportSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  count: {type: Number, default: 0}
});

mongoose.model('TestReport', ReportSchema);