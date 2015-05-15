var mongoose = require('mongoose');

var PackageSchema = new mongoose.Schema({
	name: { type: String, unique: true, required: true },
	type: { type: String, required: true },
	path: { type: String, required: true },
	description: { type: String, required: true },
	date: { type: Date, required: true }
});

module.exports = mongoose.model('TestApp', PackageSchema);