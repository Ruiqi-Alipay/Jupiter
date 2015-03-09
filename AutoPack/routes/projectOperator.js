var fs = require('fs-extra')
var path = require('path');
var Project = require('../modules/project.js');

module.exports = {
	projectId: function (req, res, next, id) {
	  Project.findById(id).exec(function (err, item){
	    if (err) { return next(err); }
	    if (!item) { return next(new Error("can't find item")); }

	    req.project = item;
	    return next();
	  });
	},
	taskId: function (req, res, next, taskId) {
		var task = req.project.tasks.id(taskId);
		req.task = task;
	    return next();
	},
	newProject: function (req, res, next) {
		req.body.date = new Date();
		req.body.state = 'Inactive';

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
	    try {
	    	var idString = JSON.stringify(req.project._id);
	    	if (idString.indexOf('"') == 0 && idString.lastIndexOf('"') == idString.length - 1) {
	    		idString = idString.slice(1, idString.length - 1);
	    	}
	    	fs.remove(path.join(__dirname, '..', 'Projects', idString), function (err) {
	    		
	    	});
	    } catch (err) {

	    }
	    
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
	},
	activeProject: function (req, res, next) {
		require('./channel.js').prepareProject(req.project, function () {
			req.project.state = 'Activating';
			req.project.save(function(err, item){
				if (err) return next(new Error('Active project failed!'));

			    res.json(item);
			});
		});
	},
	newTask: function (req, res, next) {
		req.project.tasks.push({
			date: new Date(),
			name: 'Test',
			state: 'Pennding'
		})
		req.project.save(function(err, project){
			if (err) return next(new Error('Insert new task failed!'));

		    res.json(project);
		});
	},
	startTask: function (req, res, next) {
		if (req.task.state == 'Finished') return next(new Error('Task state not correct! ' + req.task.state));

		require('../routes/channel.js').startTask(req.project, req.task, function (project) {
			res.json(project);
		}, function (error) {
			next(error);
		});
	},
	deleteTask: function (req, res, next) {
		req.project.tasks.id(req.task._id).remove();
		req.project.save(function (err, project) {
		  	if (err) return handleError(err);
		  	res.json(project);
		});
	},
	getTasks: function (req, res, next) {
		res.json(req.project);
	}
};