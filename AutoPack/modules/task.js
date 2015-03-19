var mongoose = require('mongoose');

var Task = mongoose.model('Task', mongoose.Schema({
  project: String,
  name: String,
  state: String,
  date: Date,
  downloads: String,
  actionId: String,
  pid: Number
}));

module.exports = Task;