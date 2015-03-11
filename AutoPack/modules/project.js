var mongoose = require('mongoose');

var Project = mongoose.model('Project', mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  svn: String,
  username: String,
  password: String,
  projectPath: String,
  packPath: String,
  actions: [mongoose.Schema({
  	name: String,
  	args: String
  })]
}));

module.exports = Project;