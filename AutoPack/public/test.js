            scope.onNewTask = function () {
                backendService.newTask(scope.selectProject._id, function(project) {
                    $rootScope.$broadcast('toast:show', '新建任务成功，点击开始按钮开始执行');
                }, function(error) {
                    $rootScope.$broadcast('toast:show', '新建任务失败：' + error);
                });
            };
            scope.onSelectTask= function (item) {
                backendService.selectTask(item);
            };
            scope.onStartTask = function (item) {
                backendService.startTask(scope.selectProject._id, item._id);
            };
            scope.onDeleteTask = function (item) {
                backendService.deleteTask(scope.selectProject._id, item._id);
            };
                        scope.onEditProject = function (ev, project) {
                showProjectDialog(ev, project);
            };
            scope.onActiveProject = function (ev, project) {
                backendService.activeProject(project);
            };

    var updateProject = function (newProject) {
        var project = findProject(newProject._id);
        if (project) {
            for (var key in newProject) {
                project[key] = newProject[key];
            }
        } else {
            projectList.unshift(newProject);
        }
    };
    var selectTask = function (task) {
        if (!selectedTask || selectedTask._id != task._id) {
            $rootScope.$broadcast('terminal-command', {command: 'clear'});
            $rootScope.$broadcast('terminal-output-internal', {
                output: true,
                text: ['Termainl change to Task: ' + task.date],
                breakLine: true
            });
        }
        selectedTask = task;
        $rootScope.$broadcast('selectedchange', {
            project: selectedProject,
            task: selectedTask
        });
    };
    var selectProject = function (project) {
        if (!selectedProject || selectedProject._id != project._id) {
            $rootScope.$broadcast('terminal-command', {command: 'clear'});
            $rootScope.$broadcast('terminal-output-internal', {
                output: true,
                text: ['Termainl change to Project: ' + project.name],
                breakLine: true
            });
        }
        selectedProject = project;
        $rootScope.$broadcast('selectedchange', {
            project: selectedProject,
            task: selectedTask
        });
    };
    var getProjectById = function (projectId, callback) {
        $http.get('./api/project/' + projectId).success(function(data){
            updateProject(data);
            if (callback) callback(data);
        }).error(function(error, status, headers, config) {
            $rootScope.$broadcast('toast:show', '更新项目失败：' + error);
        });
    };
    var refreshProjects = function () {

    };
    var refreshTask = function (project, task) {
        if (task && project && project._id == selectedProject._id && task._id == selectedTask._id) {
            getProjectById(project._id, function (data) {
                for (var index in data.tasks) {
                    var task = data.tasks[index];
                    if (task._id == task._id) {
                        selectTask(task);
                        return;
                    }
                }
            });
        }
    };

        activeProject: function (req, res, next) {
        require('./channel.js').prepareProject(req.project, function () {
            req.project.state = 'Activating';
            req.project.save(function(err, item){
                if (err) return next(new Error('Active project failed!'));

                res.json(item);
            });
        });
    },

        startTask: function (req, res, next) {
        if (req.task.state == 'Finished') return next(new Error('Task state not correct! ' + req.task.state));

        require('../routes/channel.js').startTask(req.project, req.task, function (project) {
            res.json(project);
        }, function (error) {
            next(error);
        });
    },





var exec = require('child_process').exec;
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs-extra');

var runningTasks = {};
var io;

var collectFiles = function (results, target, prefix) {
    var fileNames = fs.readdirSync(target);
    fileNames.forEach(function (name) {
        var filePath = path.join(target, name);
        var fileState = fs.lstatSync(filePath);
        if (fileState.isDirectory()) {
            collectFiles(results, filePath, path.join(prefix, name));
        } else if (fileState.isFile()) {
            results.push(path.join(prefix, name));
        }
    });
}

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
            fs.removeSync(buildPath);
        }

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