var fs = require('fs-extra')
var path = require('path');
var Task = require('../modules/task.js');

module.exports = {
	taskId: function (req, res, next, taskId) {
		Task.findById(taskId).exec(function (err, task) {
			if (err) return next(err);
			if (!task) return next(new Error('Task not found :' + taskId));

			req.task = task;
		    return next();
		});
	},
	createTask: function (req, res, next) {
		if (!req.body.name || !req.body.actionId) return next(new Error('Unformated prameter for new task!'));

		var task = new Task({
			project: req.project._id,
			name: req.body.name,
			state: 'Pennding',
			date: new Date(),
			actionId: req.body.actionId
		});

		task.save(function (err, newTask) {
			if (err) return next(new Error('Create new task failed!: ' + task.name));

		    res.json(newTask);
		});
	},
	deleteTask: function (req, res, next) {
		if (req.task.state == 'Running' && req.task.pid > 0) {
			process.kill(req.task.pid);
		}

		var downloadDir = path.join(__dirname, '..', 'download', req.task._id.toString());
		if (fs.existsSync(downloadDir)) {
			fs.remove(downloadDir);
		}
		
		req.task.remove(function (err, deletedTask) {
		  	if (err) return next(err);

		  	res.json(deletedTask);
		});
	},
	getProjectActiveTasks: function (req, res, next) {
		if (!req.param('project')) return next(new Error('Unformated prameter for query task!'));

		Task.find({'project': req.param('project'), 'state': {$in: ['Running', 'Pennding', 'Failed']}}, function (err, tasks) {
			if (err) return next(err);

			res.json(tasks);
		});
	},
	getProjectHistoryTasks: function (req, res, next) {
		if (!req.param('project')) return next(new Error('Unformated prameter for query task!'));

		Task.find({'project': req.param('project'), 'state': 'Success'}, function (err, tasks) {
			if (err) return next(err);

			res.json(tasks);
		});
	}
};

