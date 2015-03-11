var Task = require('../modules/task.js');
var Project = require('../modules/project.js');
var running = require('is-running');
var q = require('q');
var fse = require('fs-extra');
var exec = require('child_process').exec;
var channel = require('./channel.js');
var path = require('path');

// 	"args": {
// 		"dir.spec": "$SVN_PATH",
// 		"signals": "4",
// 		"info": ""
//	 },
// 	"name": "【开发环境包】打包framework和Demo，不混淆代码包含日志"
// },
//
// 这里的args对应上面的json里面的args
var makeArgs = function (dir, action) {
	var cmd = '';
	var args = JSON.parse(action.args);
	for (var key in args) {
		var value = args[key];
		if (value == '$SVN_PATH') {
			value = dir;
		}
		cmd += (' -D' + key + '=' + value);
	}

	return cmd;
}

var correctRunningState = function (argument) {
	var defer = q.defer();

	Task.find({'state': 'Running'}, function (err, tasks) {
		if (tasks) {
			tasks.forEach(function (task) {
				if (!task.pid || !running(task.pid)) {
					task.state = 'Failed';
					task.save();
					channel.emit(task.project, 'active-task-change');
				}
			});
			defer.resolve(tasks);
		} else {
			defer.resolve();
		}
	});

	return defer.promise;
};

var runTask = function (project, task, action) {
	var defer = q.defer();

	try {
		channel.emit(task._id, 'Preparing for task: ' + task.name);
		var dir = path.join(__dirname, '..', 'Projects', task.project);
		exec('sudo rm -R ' + dir, function (error, stdout, stderr) {
			if (error) return defer.reject(error);

			channel.emit(task._id, 'SVN checking out: ' + project.svn);
			var command = 'svn checkout --username ' + project.username + ' --password ' + project.password
					+ ' ' + project.svn + ' ' + dir;
			var child = exec(command, {
					maxBuffer: 200*1024*1024
				}, function (error, stdout, stderr){
					channel.emit(task._id, 'SVN checking complate! preparing to build project...');

					var args = makeArgs(dir, action);
					var jarPath = path.join(dir, project.packPath);
					var child = exec('java -Dfile.encoding=UTF-8' + args + ' -jar pack.jar', {
								cwd: jarPath,
								maxBuffer: 200*1024*1024
							}, function (error, stdout, stderr){
								if (error) console.log(error);
								if (stderr) console.log(stderr);

								var result = path.join(__dirname, '..', 'Projects', task.project, project.packPath, 'result.json');
								if (fse.existsSync(result)) {
									var result = fse.readJson(result);
									if (result.result) {
										// var saveDir = path.join(__dirname, '..', 'download', task._id.toString());
										// fse.copySync(, saveDir);
										// var fileList = [];
										// var downlaodRecord = [];
										// collectFiles(fileList, saveDir, '');
										// fileList.forEach(function (path) {
										// 	downlaodRecord.push({
										// 		name: path.slice(path.lastIndexOf('/') + 1),
										// 		path: path
										// 	})
										// })
										// task.downloads = JSON.stringify(downlaodRecord);
										defer.resolve(task);
									} else {
										defer.reject(new Error('Pack failed!'));
									}
								} else {
									defer.reject(new Error('Result file not found!'));
								}

								if (fse.existsSync(dir)) {
									// fse.remove(dir);
								}
								channel.emit(task._id, '*** Build execution ' + (true ? 'finished! ***' : 'failed! ***'));
							});

					child.stdout.on('data', function (data) {
						channel.emit(task._id, data);
					});

					task.pid = child.pid;
					task.state = 'Running';
					task.save();
				});

			child.stdout.on('data', function (data) {
				channel.emit(task._id, data);
			});

			task.pid = child.pid;
			task.state = 'Running';
			task.save();
		});
	} catch (err) {
		console.log(err);

		defer.reject(err);
	}

	return defer.promise;
};
var collectFiles = function (results, target, prefix) {
    var fileNames = fse.readdirSync(target);
    fileNames.forEach(function (name) {
        var filePath = path.join(target, name);
        var fileState = fse.lstatSync(filePath);
        if (fileState.isDirectory()) {
            collectFiles(results, filePath, path.join(prefix, name));
        } else if (fileState.isFile()) {
            results.push(path.join(prefix, name));
        }
    });
}
var findAction = function (actions, actionId) {
	for (var index in actions) {
		var action = actions[index];
		if (action._id == actionId) {
			return action;
		}
	}
}

setInterval(function () {
	console.log('======================== Cron jonbs running ========================');
	correctRunningState().then(function (runningTasks) {
		var runningProject = [];
		if (runningTasks) {
			runningTasks.forEach(function (task) {
				if (task.state == 'Running') runningProject.push(task.project);
			});
		}

		Project.find({'_id': {$nin: runningProject}}, function (err, projects) {
			if (projects) {
				projects.forEach(function (project) {
					Task.find({ 'project': project._id, 'state': 'Pennding' }).limit(1).sort('date').exec(function (err, tasks) {
						var task = tasks ? tasks[0] : undefined;
						if (task) {
							var action = findAction(project.actions, task.actionId);
							if (action && action._id) {
								runTask(project, task, action).then(function (finishedTask) {
									task.pid = -1;
									task.state = 'Success';
									task.save();

									channel.emit(task.project, 'active-task-change');
								}).catch(function (err) {
									console.log(err);

									task.pid = -1;
									task.state = 'Failed';
									task.save();

									channel.emit(task.project, 'active-task-change');
								});

								channel.emit(task.project, 'active-task-change');
							} else {
								task.pid = -1;
								task.state = 'Failed';
								task.save();
							}
						}
					});
				});
			}
		});
	});
}, 30000);

module.exports = {

};





