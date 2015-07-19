var mongoose = require('mongoose');

var FolderSchema = new mongoose.Schema({
	username: { type: String, required: true},
	title: { type: String, unique: true, required: true}
});

module.exports = mongoose.model('TestScriptFolder', FolderSchema);