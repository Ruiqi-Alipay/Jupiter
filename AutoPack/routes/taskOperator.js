var fs = require('fs')
var path = require('path');
var Task = require('../modules/task.js');
var Project = require('../modules/project.js');
var exec = require('child_process').exec;
var lineReader = require('line-reader');

var email   = require(path.join(__dirname, '..', 'node_modules', 'emailjs', "email.js"));
var server  = email.server.connect({
   user:    "sdkpack@alibaba-inc.com", 
   password:"2014@sdk", 
   host:    "smtp.zue.alipay.com",
   port: 25,
   ssl: false
});

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
	},
	sendEmail: function (req, res, next) {
		if (!req.body.address) return next(new Error('Email address is empty!'));
		if (!req.task.downloads) return next(new Error('Task has nothing for download!'));

		Project.findById(req.task.project).exec(function (err, project) {
			if (err) return next(err);

			var findAction;
			for (var index in project.actions) {
				var action = project.actions[index];
				if (action._id == req.task.actionId) {
					findAction = action;
					break;
				}
			}

			if (!findAction) return next(new Error('Action not found in project'));

			var downloads = JSON.parse(req.task.downloads);
			var mailText = '';
			var mailHtml = '<div>';
			downloads.forEach(function (download) {
				mailText += (download.name + '\r\n' + download.link + '\r\n');
				mailHtml += ('<b>' + download.name + '</b><br><a href="' + download.link + '">' + download.link + '</a><br><img src="' + download.link + '.png"><br>');
			});
			mailHtml += '</div>';

			var message = {
			   text: mailText, 
			   from: 'SDK PACK SERVER <sdkpack@alibaba-inc.com>', 
			   to: req.body.address,
			   subject: '在线打包：' + req.task.name + '(' + findAction.name + ')',
			   attachment: 
			   [
			      {data: mailHtml, alternative:true}
			   ]
			};

			// send the message and get a callback with an error or details of the message that was sent
			server.send(message, function(err, message) {
			    if(err){
			    	console.log(err);
			        return next(err);
			    }

				res.json(message);
			});
		});
	},
	getRecord: function (req, res, next) {
		if (!req.param('listener')) return next(new Error('Must have a listener prameter!'));

		var listener = req.param('listener');
		var recordPath = path.join(__dirname, '..', 'download', req.task._id.toString(), 'record.log');
		if (!fs.existsSync(recordPath)) return next(new Error('Record not found!'));

		var channel = require('./channel.js');

		lineReader.eachLine(recordPath, function(line, last) {
		  channel.emit(listener, line);
		});

		res.json({
			listener: listener
		});
	}
};

