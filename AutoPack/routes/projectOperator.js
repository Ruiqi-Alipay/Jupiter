var mongoose = require('mongoose');
var path = require('path');
var Project = mongoose.model('Project', mongoose.Schema({
  name: String,
  state: String,
  date: Date,
  svn: String,
  auth: String,
  packPath: String
}));

module.exports = {
	projectId: function (req, res, next, id) {
	  Project.findById(id).exec(function (err, item){
	    if (err) { return next(err); }
	    if (!item) { return next(new Error("can't find item")); }

	    req.project = item;
	    return next();
	  });
	},
	newProject: function (req, res, next) {
		req.body.date = new Date();
		req.body.state = 'Preparing';

		var project = new Project(req.body);
		project.save(function(err, item){
			if (err) return next(new Error('Insert new project failed!'));

		    res.json(item);
		});
	},
	editProject: function (req, res, next) {
		req.project.date = new Date();
		req.project.name = req.body.name;
		req.project.svn = req.body.svn;
		req.project.auth = req.body.auth;
		req.project.packPath = req.body.packPath;

		req.project.save(function(err, item){
			if (err) return next(new Error('Update project failed!'));

		    res.json(item);
		});
	},
	deleteProject: function (req, res, next) {
	  req.project.remove(function(err, item){
	    if (err) { return next(err); }

	    res.json(item);
	  });
	},
	getProjects: function (req, res, next) {
	    Project.find(function(err, items){
	      if(err){ return next(err); }

	      res.json(items);
	    });
	},
	getProjectById: function (req, res, next) {
	    res.json(req.project);
	}
};