var mongoose = require('mongoose');

var TestScriptSchema = new mongoose.Schema({
  title: String,
  content: String,
  folder: String,
  type: String,
  date: Date,
  count: {type: Number, default: 0}
});

module.exports = mongoose.model('TestScript', TestScriptSchema);