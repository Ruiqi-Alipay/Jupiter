var mongoose = require('mongoose');

var Task = mongoose.model('Task', mongoose.Schema({
  project: String,
  name: String,
  state: String,
  date: Date,
  downloads: [],
  action: String
}));

module.exports = Task;