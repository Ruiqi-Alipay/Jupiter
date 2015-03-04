var mongoose = require('mongoose');
var path = require('path');
var Task = mongoose.model('Task', mongoose.Schema({
  name: String,
  state: String,
  date: Date,
  retry: {type: Number, default: 0}
}));

module.exports = {
	taskId: function (req, res, next, taskId) {
	  Task.findById(taskId).exec(function (err, item){
	    if (err) { return next(err); }
	    if (!item) { return next(new Error("can't find item")); }

	    req.task = item;
	    return next();
	  });
	},
	newTask: function (req, res, next) {
		var newTask = new Task({
			date: new Date(),
			name: 'Test',
			state: 'Pennding'
		});
		newTask.save(function(err, newTask){
			if (err) return next(new Error('Insert new task failed!'));

		    res.json(newTask);
		});
	},
	startTask: function (req, res, next) {
		if (req.task.state == 'Finished') return next(new Error('Task state not correct! ' + req.task.state));

		require('../routes/channel.js').newChannel(req.task, function (runningTask) {
			res.json(runningTask);
		}, function (error) {
			next(error);
		});
	},
	deleteTask: function (req, res, next) {
	  req.task.remove(function(err, item){
	    if (err) { return next(err); }

	    res.json(item);
	  });
	},
	getTasks: function (req, res, next) {
	    Task.find(function(err, items){
	      if(err){ return next(err); }

	      res.json(items);
	    });
	},
	getTaskById: function (req, res, next) {
	    res.json(req.task);
	}
};