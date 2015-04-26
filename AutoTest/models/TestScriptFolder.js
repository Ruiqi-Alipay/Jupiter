var mongoose = require('mongoose');

var TestScriptFolderSchema = new mongoose.Schema({
  title: String,
});

module.exports = mongoose.model('TestScriptFolder', TestScriptFolderSchema);