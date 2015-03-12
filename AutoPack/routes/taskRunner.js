var Task = require('../modules/task.js');
var Project = require('../modules/project.js');
var running = require('is-running');
var q = require('q');
var fs = require('fs');
var exec = require('child_process').exec;
var channel = require('./channel.js');
var path = require('path');
var qr = require('qr-image');

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
					channel.emit(task.project, 'run-task-finished');
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
			channel.emit(task._id, 'SVN checking out: ' + project.svn);
			var command = 'svn checkout --username ' + project.username + ' --password ' + project.password
					+ ' ' + project.svn + ' ' + dir;
			var child = exec(command, {
					maxBuffer: 200*1024*1024
				}, function (error, stdout, stderr){
					channel.emit(task._id, 'SVN checking complate! preparing to build project...');

					var args = makeArgs(dir, action);
					var jarPath = path.join(dir, project.packPath);
					var saveDir = path.join(__dirname, '..', 'download', task._id.toString());
					var child = exec('java -Dfile.encoding=UTF-8' + args + ' -jar pack.jar', {
								cwd: jarPath,
								maxBuffer: 200*1024*1024
							}, function (error, stdout, stderr){
								if (error) console.log(error);
								if (stderr) console.log(stderr);

								var result = path.join(__dirname, '..', 'Projects', task.project, project.packPath, 'result.json');
								if (fs.existsSync(result)) {
									var result = JSON.parse(fs.readFileSync(result));
									if (result && result.result && result.pkgs) {
										var fse = require('fs-extra');
										var downlaodRecord = [];
										result.pkgs.forEach(function (pkgPath) {
											var fileName = pkgPath.slice(pkgPath.lastIndexOf('/') + 1);
											fse.copySync(path.join(dir, pkgPath), path.join(saveDir, fileName));
											
											var link = 'http://autotest.d10970aqcn.alipay.net/autopack/download/' + task._id.toString() + '/' + fileName;

											var code = qr.image(link, { type: 'png' });
											var output = fs.createWriteStream(path.join(saveDir, fileName + '.png'));
											code.pipe(output);

											downlaodRecord.push({
												name: fileName,
												link: link
											});
										});

										task.downloads = JSON.stringify(downlaodRecord);
										defer.resolve(task);
									} else {
										defer.reject(new Error('Pack failed!'));
									}
								} else {
									defer.reject(new Error('Result file not found!'));
								}

								channel.emit(task._id, '*** Build execution ' + (true ? 'finished! ***' : 'failed! ***'));
							});

					child.stdout.on('data', function (data) {
						channel.emit(task._id, data);
					});

					child.stdout.pipe(fs.createWriteStream(path.join(saveDir, 'record.log')));

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

			channel.emit(task.project, 'run-task-start');
		});
	} catch (err) {
		console.log(err);

		defer.reject(err);
	}

	return defer.promise;
};
var findAction = function (actions, actionId) {
	for (var index in actions) {
		var action = actions[index];
		if (action._id == actionId) {
			return action;
		}
	}
}

var startJob = function () {
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
									finishedTask.pid = -1;
									finishedTask.state = 'Success';
									finishedTask.save();

									channel.emit(task._id, '========================================');
									channel.emit(task._id, '===         Build Success           === ');
									channel.emit(task._id, '========================================');
									channel.emit(task.project, 'run-task-finished');
								}).catch(function (err) {
									console.log(err);

									task.pid = -1;
									task.state = 'Failed';
									task.save();
									
									if (err) {
										channel.emit(task._id, err.toString());
									}
									
									channel.emit(task._id, '========================================');
									channel.emit(task._id, '===         Build Failed           === ');
									channel.emit(task._id, '========================================');
									channel.emit(task.project, 'run-task-finished');
								});
							} else {
								task.pid = -1;
								task.state = 'Failed';
								task.save();
								channel.emit(task.project, 'run-task-finished');
							}
						}
					});
				});
			}
		});
	});
};

setInterval(function () {
	console.log('======================== Cron jonbs running ========================');
	startJob();
}, 30000);

module.exports = {
	startJob: function () {
		startJob();
	}
};





