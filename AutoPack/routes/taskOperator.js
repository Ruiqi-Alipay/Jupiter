var fs = require('fs')
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
			exec('sudo rm -R ' + downloadDir);
		}
		
		req.task.remove(function (err, deletedTask) {
		  	if (err) return next(err);

		  	res.json(deletedTask);
		});
	},
	getProjectActiveTasks: function (req, res, next) {
		if (!req.param('project')) return next(new Error('Unformated prameter for query task!'));

		Task.find({'project': req.param('project'), 'state': {$in: ['Running', 'Pennding']}}).sort('date').exec(function (err, tasks) {
			if (err) return next(err);

			res.json(tasks);
		});
	},
	getProjectHistoryTasks: function (req, res, next) {
		if (!req.param('project')) return next(new Error('Unformated prameter for query task!'));

		var next = req.param('next');
		var prev = req.param('prev');
		var selection = {
			'project': req.param('project'),
			'state': {$nin: ['Running', 'Pennding']}
		};
		if (prev) {
			selection['date'] ={
				$gt: decodeURIComponent(prev)
			}
		} else if (next) {
			selection['date'] ={
				$lt: decodeURIComponent(next)
			}
		}

		console.log(selection);

		Task.find(selection).sort('-date').limit(10).exec(function (err, tasks) {
			if (err) return next(err);

			res.json(tasks);
		});
	}
};

