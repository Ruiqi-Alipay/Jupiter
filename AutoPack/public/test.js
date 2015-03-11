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