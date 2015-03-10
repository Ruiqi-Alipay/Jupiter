var exec = require('child_process').exec;
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs-extra');

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

		var buildPath = path.join(project.projectPath, project.buildPath);
		if (fs.existsSync(buildPath)) {
			fs.rmdirSync(buildPath);
		}

		var distPath = path.join(project.projectPath, project.packPath.slice(0, project.packPath.indexOf('pack.jar') - 1));
		var child = exec('java -Dfile.encoding=UTF-8 -jar pack.jar', {
					cwd: distPath,
					maxBuffer: 200*1024*1024
				}, function (error, stdout, stderr){
					if (error) console.log(error);
					if (stderr) console.log(stderr);

					var success = fs.existsSync(buildPath);

					for (var index in project.tasks) {
						if (project.tasks[index]._id == task._id) {
							if (success) {
								project.tasks[index].state = 'Finished';
							} else {
								project.tasks[index].state = 'Pennding';
							}
							
							break;
						}
					}
					project.save();
					delete runningTasks[task._id];

					if (success) {
						var targetDir = path.join(__dirname, '..', 'download', project._id.toString(), task._id.toString());
						fs.ensureDirSync(targetDir);
						fs.copySync(buildPath, targetDir);
					} else {
						if (error) io.emit(task._id, error);
						if (stderr) io.emit(task._id, stderr);
					}

					io.emit(task._id, '*** Build execution ' + (success ? 'finished! ***' : 'failed! ***'));
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
		var dir = path.join(__dirname, '..', 'Projects', project._id.toString());
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