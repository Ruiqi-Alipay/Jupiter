var exec = require('child_process').exec;
var path = require('path');
var mongoose = require('mongoose');

var runningTasks = {};
var io;

module.exports = {
	start: function (http) {
		io = require('socket.io')(http);
		io.on('connection', function(socket){
		  socket.on('userInput', function(msg){
		    var child = runningTasks[msg.id];
		    if (child) {
		    	var cmd = msg.cmd + '\r\n';
		    	console.log('USER INPUT: ' + cmd);
		    	child.stdin.write(cmd);
		    }
		  });
		});
	},
	startTask: function (project, task, success, error) {
		if (task._id in runningTasks || task.state == 'Finished') {
			console.log('Task is running or already finished!');
			return success(project); 
		}

		var distPath = path.join(project.projectPath, project.packPath.slice(0, project.packPath.indexOf('pack.jar') - 1));
		var child = exec('java -Dfile.encoding=UTF-8 -jar pack.jar', {
					cwd: distPath
				}, function (error, stdout, stderr){
			for (var index in project.tasks) {
				if (project.tasks[index]._id == task._id) {
					project.tasks[index].state = 'Finished';
					break;
				}
			}
			project.save();
			delete runningTasks[task._id];

			io.emit(task._id, 'Build jar execution finished!');
		});

		child.stdout.on('data', function (data) {
			io.emit(task._id, data);
		});

		runningTasks[task._id] = child;
		for (var index in project.tasks) {
			if (project.tasks[index]._id == task._id) {
				project.tasks[index].state = 'Running';
				break;
			}
		}
		project.save(function (err, item) {
			if (err) return error(new Error('Insert new task failed!'));

		    success(item);
		});
	},
	prepareProject: function (project, callback) {
		var success = true;
		var idString = JSON.stringify(project._id);
    	if (idString.indexOf('"') == 0 && idString.lastIndexOf('"') == idString.length - 1) {
    		idString = idString.slice(1, idString.length - 1);
    	}
		var dir = path.join(__dirname, '..', 'Projects', idString);
		var params = (project.username && project.password) ? ('--username ' + project.username + ' --password ' + project.password + ' ') : '';
		var child = exec('svn checkout ' + params + project.svn + ' ' + dir,
				function (error, stdout, stderr){
			if (success) {
				project.state = 'Active';
				project.projectPath = dir;
				project.save();

				io.emit(project._id, '----------------------------------');
				io.emit(project._id, '- Project now is ready for pack! -');
				io.emit(project._id, '----------------------------------');

				console.log('Activing project ' + project.name + ' success!')
			} else {
				project.state = 'Inactive';
				project.save();

				io.emit(project._id, '----------------------------------');
				io.emit(project._id, '- Project activating falied!     -');
				io.emit(project._id, '----------------------------------');

				console.log('Activing project ' + project.name + ' failed!')
			}
		});

		child.stdout.on('data', function (data) {
			io.emit(project._id, data);
		});

		callback();
	}
};