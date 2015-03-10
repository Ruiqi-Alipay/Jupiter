var backendService = angular.module('backend-service', []);
backendService.factory('backendService', function ($http, $rootScope) {
	var socket = io();
	var projectList = [];
	var findProject = function (projectId) {
		for (var index in projectList) {
			var item = projectList[index];
			if (item._id == projectId) {
				return item;
			}
		}
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
		$http.get('./api/project').success(function(projects){
			projectList.length = 0;
			projectList.push.apply(projectList, projects);
	  	}).error(function(error, status, headers, config) {
	  		$rootScope.$broadcast('toast:show', '同步工程列表出错：' + error);
	  	});
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
    var listen = function (listenId) {
        if (listenId == oldListenerId) {
            return;
        }

        if (oldListenerId) {
            socket.removeAllListeners(oldListenerId);
        }
        oldListenerId = listenId;

        socket.on(listenId, function(data) {
          if (hidePrompt) {
          	$rootScope.$broadcast('secondary-command', {command: 'showPrompt'});
          	hidePrompt = false;
          }
          if (data.indexOf('Project now is ready for pack!') >= 0) {
              refreshProjects();
          } else if (data.indexOf('*** Build execution') >= 0) {
              refreshTask(selectedProject, selectedTask);
          }
          $rootScope.$broadcast('terminal-output', {
              output: true,
              text: [data],
              breakLine: true
          });
        });
    };
	var selectedProject;
	var selectedTask;
	var oldListenerId;
	var hidePrompt;

	return {
		socketInput: function (command) {
            socket.emit('userInput', {
              id: oldListenerId,
              cmd: command
            });
            $rootScope.$broadcast('secondary-command', {command: 'hidePrompt'});
            hidePrompt = true;
		},
		selectTask: function (task) {
			selectTask(task);
		},
		getSelectedTask: function () {
			return selectedTask;
		},
		selectProject: function (project) {
			selectProject(project);
		},
		getSelectedProject: function () {
			return selectedProject;
		},
		getProjects: function () {
			refreshProjects();
			return projectList;
		},
		getTasks: function (projectId) {
			return findProject(projectId).tasks;
		},
		newTask: function (projectId) {
			$http.post('./api/project/' + projectId + '/task').success(function(data){
		    	updateProject(data);
		    	$rootScope.$broadcast('toast:show', '新建任务成功，点击开始按钮开始执行');
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '新建任务失败：' + error);
		  	});
		},
		startTask: function (projectId, taskId) {
			listen(taskId);
			$http.get('./api/project/' + projectId + '/start/' + taskId).success(function(data){
		    	updateProject(data);
		    	for (var index in data.tasks) {
		    		var task = data.tasks[index];
		    		if (task._id == taskId) {
		    			selectTask(task);
		    			return;
		    		}
		    	}
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '执行任务失败：' + error);
		  	});
		},
		deleteTask: function (projectId, taskId) {
			$http.delete('./api/project/' + projectId + '/task/' + taskId).success(function(data){
		    	updateProject(data);
		    	$rootScope.$broadcast('toast:show', '删除成功');
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '删除失败：' + error);
		  	});
		},
		newEditProject: function (project) {
			if (project._id) {
				$rootScope.$broadcast('toast:show', '工程修改中...');
				$http.post('./api/project/' + project._id, project).success(function(data){
					updateProject(data);
					$rootScope.$broadcast('toast:show', '修改成功');
			  	}).error(function(error, status, headers, config) {
			  		$rootScope.$broadcast('toast:show', '修改失败：' + error);
			  	});
			} else {
				$rootScope.$broadcast('toast:show', '工程创建中...');
				$http.post('./api/project', project).success(function(data){
					updateProject(data);
					$rootScope.$broadcast('toast:show', '创建成功');
			  	}).error(function(error, status, headers, config) {
			  		$rootScope.$broadcast('toast:show', '创建失败：' + error);
			  	});
			}
		},
		activeProject: function (project) {
			listen(project._id);
			$http.get('./api/project/' + project._id + '/active').success(function(data){
		    	updateProject(data);
		    	selectProject(data);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', 'Failed to active：' + error);
		  	});
		},
		getProjectById: function (projectId, callback) {
			getProjectById(projectId, callback);
		},
		deleteProject: function (id) {
			$http.delete('./api/project/' + id).success(function(data){
		    	updateProject(data);
		    	$rootScope.$broadcast('toast:show', '删除成功');
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '删除失败：' + error);
		  	});
		}
	};
});