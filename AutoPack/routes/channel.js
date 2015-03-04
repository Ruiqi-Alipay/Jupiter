var app = require('../app');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var exec = require('child_process').exec;

var channelMap = {};

io.on('connection', function(socket){
  socket.on('userInput', function(msg){
    var child = channelMap[msg.id];
    if (child) {
    	child.stdin.write(msg.cmd + '\r\n');
    }
  });
});

module.exports = {
	start: function (port) {
		http.listen(port, function() {
		  console.log('Autopack server started! listening on port ' + port);
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
	}
};