var fs = require('fs-extra')
var path = require('path');
var Project = require('../modules/project.js');
var Task = require('../modules/task.js');
var request = require('request');
var exec = require('child_process').exec;

module.exports = {
	projectId: function (req, res, next, id) {
	  Project.findById(id).exec(function (err, item){
	    if (err) { return next(err); }
	    if (!item) { return next(new Error("can't find item")); }

	    req.project = item;
	    return next();
	  });
	},
	createProject: function (req, res, next) {
		if (!req.body.name || !req.body.description || !req.body.svn
				|| !req.body.username || !req.body.password || !req.body.packPath) {
			return next(new Error('Incorrect prameters for project creation!'));
		}

		if (req.body.svn[req.body.svn.length - 1] != '/') {
			req.body.svn += '/';
		}
		if (req.body.packPath[req.body.packPath.length - 1] != '/') {
			req.body.packPath += '/';
		}
		if (req.body.packPath[0] == '/') {
			req.body.packPath = req.body.packPath.slice(1);
		}

		var currentDate = new Date();
		var output = path.join(__dirname, '..', 'Temp', currentDate.getTime() + '.json');
		var functionJsonSvn = req.body.svn + req.body.packPath + 'function.json';
		var command = 'svn export --username ' + req.body.username + ' --password ' + req.body.password + ' '+ functionJsonSvn + ' ' + output;
		console.log('COMMAND: ' + command);
		var child = exec(command, function (error, stdout, stderr){
			if (!fs.existsSync(output)) {
				return next(new Error('Export function.json file not found or username/password not correct!'));
			}

			var actions = fs.readJsonSync(output);
			fs.remove(output);
			if (!(actions instanceof Array) || actions.length == 0) {
				return next(new Error('Can not extract actions from function.json!'));
			}
			for (var index in actions) {
				var action = actions[index];
				if (!action.name || !action.args) return next(new Error('Each action in function.json must have name and args property!'));
				action.args = JSON.stringify(action.args);
			}

			var project = new Project(req.body);
			project.date = new Date();
			project.actions = actions;
			project.save(function(err, item){
				if (err) return next(new Error('Insert new project failed!'));

			    res.json(item);
			});
		});
		console.log(child);
	},
	editProject: function (req, res, next) {
		for (var key in req.body) {
			if (key == '_id') continue;
			req.project[key] = req.body[key];
		}
		req.project.date = new Date();
		req.project.save(function(err, item){
			if (err) return next(new Error('Update project failed!'));

		    res.json(item);
		});
	},
	deleteProject: function (req, res, next) {
	  req.project.remove(function(err, item){
	    if (err) { return next(err); }
	    try {
	    	var idString = req.project._id.toString();
	    	fs.remove(path.join(__dirname, '..', 'Projects', idString));
	    	fs.remove(path.join(__dirname, '..', 'download', idString));
	    } catch (err) {
	    	return next(err);
	    }

	    Task.find({'project': req.project._id}).remove().exec(function (err, result) {
	    	if (err) console.log('Delete project tasks failed!');

	    	console.log('Deleted Task: ' + result);
	    });
	    
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