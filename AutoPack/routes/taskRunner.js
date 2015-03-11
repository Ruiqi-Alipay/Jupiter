var Task = require('../modules/task.js');
var Project = require('../modules/project.js');
var running = require('is-running')
var q = require('q');
var fs = require('fs-extra');
var exec = require('child_process').exec;

// 	"args": {
// 		"dir.spec": "$SVN_PATH",
// 		"signals": "4",
// 		"info": ""
//	 },
// 	"name": "【开发环境包】打包framework和Demo，不混淆代码包含日志"
// },
//
// 这里的args对应上面的json里面的args
var makeArgs = function (project, action) {
	var cmd = '';
	var args = JSON.parse(action.args);
	for (var key in args) {
		var value = args[key];
		if (value == '$SVN_PATH') {
			value = project.svn;
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
	var dir = path.join(__dirname, '..', 'Projects', task.project);
	if (fs.existsSync(dir)) {
		fs.removeSync(dir);
	}
	var params = '--username ' + project.username + ' --password ' + project.password;
	exec('svn checkout ' + params + project.svn + ' ' + dir,{
			maxBuffer: 200*1024*1024
		}, function (error, stdout, stderr){
			var distPath = path.join(project.projectPath, project.packPath.slice(0, project.packPath.indexOf('pack.jar') - 1));
			var child = exec('java -Dfile.encoding=UTF-8 -jar pack.jar', {
						cwd: distPath,
						maxBuffer: 200*1024*1024
					}, function (error, stdout, stderr){
						if (error) console.log(error);
						if (stderr) console.log(stderr);

						var success = fs.existsSync(buildPath);
						var targetIndex;
						for (var index in project.tasks) {
							if (project.tasks[index]._id == task._id) {
								targetIndex = index;
								break;
							}
						}
						var targetTask = project.tasks[targetIndex];

						if (success) {
							var targetDir = path.join(__dirname, '..', 'download', project._id.toString(), task._id.toString());
							fs.ensureDirSync(targetDir);
							fs.copySync(buildPath, targetDir);

							targetTask.state = 'Finished';
							targetTask.downloads = [];
							collectFiles(targetTask.downloads, targetDir, '');
							console.log('Files for download: ')
							console.log(targetTask.downloads);
						} else {
							if (error) io.emit(task._id, error);
							if (stderr) io.emit(task._id, stderr);

							project.tasks[index].state = 'Pennding';
						}

						project.save();
						delete runningTasks[task._id];

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
		});
};

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

		Project.find({'_id': {$nin: runningProject}}, {'_id': 1, 'actions': 1}, function (err, projects) {
			if (projects) {
				projects.forEach(function (project) {
					Task.find({ 'project': project._id, 'state': 'Pennding' }).limit(1).sort('date').exec(function (err, tasks) {
						var task = tasks ? tasks[0] : undefined;
						if (task) {
							var action = findAction(project.actions, task.actionId);
							if (action) {
								runTask(task, action);
							} else {
								task.state = 'Failed';
								task.save();
							}
						}
					});
				});
			}
		});
	});
}, 10000);

module.exports = {

};





