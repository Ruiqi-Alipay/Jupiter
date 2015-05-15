var mongoose = require('mongoose');

var ReportSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	date: { type: Date, required: true}
});

module.exports = mongoose.model('TestReport', ReportSchema);