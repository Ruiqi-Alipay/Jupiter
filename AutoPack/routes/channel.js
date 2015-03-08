var exec = require('child_process').exec;
var path = require('path');

var channelMap = {};
var io;

module.exports = {
	start: function (http) {
		io = require('socket.io')(http);
		io.on('connection', function(socket){
		  socket.on('userInput', function(msg){
		    var child = channelMap[msg.id];
		    if (child) {
		    	var cmd = msg.cmd + String.fromCharCode(13);
		    	console.log('USER INPUT: ' + cmd);
		    	child.stdin.write(cmd);
		    }
		  });
		});
	},
	newChannel: function (task, success, error) {
		if (task._id in channelMap || task.state == 'Finished') {
			console.log('Channel exist !');
			success(task); 
		}

		var originPath = process.cwd();
		var distPath = path.join(originPath, 'internation_sdk', 'autopack');
		process.chdir(distPath)
		var child = exec('java -Dfile.encoding=UTF-8 -jar pack.jar',
				function (error, stdout, stderr){
			task.state = 'Finished';
			task.save();
			delete channelMap[task._id];
		});
		process.chdir(originPath);

		child.stdout.on('data', function (data) {
			io.emit(task._id, data);
		});

		task.state = 'Running';
		task.save(function (err, newTask) {
			if (err) return error(new Error('Insert new task failed!'));

		    success(newTask);
		});

		channelMap[task._id] = child;
	},
	prepareProject: function (project, callback) {
		var success = true;
		var dir = path.join(__dirname, '..', 'Projects', JSON.stringify(project._id));
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