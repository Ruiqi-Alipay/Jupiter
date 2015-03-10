var mongoose = require('mongoose');

var Project = mongoose.model('Project', mongoose.Schema({
  name: String,
  state: String,
  date: Date,
  svn: String,
  username: String,
  password: String,
  projectPath: String,
  packPath: String,
  buildPath: String,
  tasks: [mongoose.Schema({
	  name: String,
	  state: String,
	  date: Date,
    downloads: [],
	  retry: {type: Number, default: 0}
  })]
}));

module.exports = Project;