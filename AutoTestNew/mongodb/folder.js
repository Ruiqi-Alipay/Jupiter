var mongoose = require('mongoose');

var FolderSchema = new mongoose.Schema({
	title: { type: String, unique: true, required: true}
});

module.exports = mongoose.model('TestScriptFolder', FolderSchema);