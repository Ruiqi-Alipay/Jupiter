var mongoose = require('mongoose');

var ScriptSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	folder: { type: String, required: true },
	type: { type: String, required: true },
	date: { type: Date, required: true }
});

module.exports = mongoose.model('TestScript', ScriptSchema);