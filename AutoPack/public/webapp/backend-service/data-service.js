var dataService = angular.module('backend-service');
dataService.factory('dataService', function ($rootScope, $mdDialog, $q, restService) {
	var projectsList = [];
  var activeTaskList = [];
  var historyTaskList = [];
  var selectedProject;

  var socket = io();

  var listenOnProject = function (oldProject, newProject) {
      if (oldProject && oldProject._id == newProject._id) {
          return;
      }

      if (oldProject) {
          socket.removeAllListeners(oldProject._id);
      }

      socket.on(newProject._id, function(command) {
        if (isCurrentProject(newProject._id)) {
          if (command == 'run-task-start') {
            syncProjectActiveTasks(newProject._id);
          } else if (command == 'run-task-finished') {
            syncProjectActiveTasks(newProject._id);
            historyTaskList.length = 0;
            syncProjectHistoryTasks(newProject._id, true);
          }
        }
      });
  };

  var isCurrentProject = function (projectId) {
    return selectedProject && selectedProject._id == projectId;
  };
  var findProjectIndex = function (project) {
      for (var index in projectsList) {
          var item = projectsList[index];
          if (item._id == project._id) {
              return index;
          }
      }
  };
  var deleteProject = function (project) {
  	var index = findProjectIndex(project);
  	projectsList.splice(index, 1);
  	if (selectedProject && selectedProject._id == project._id) {
  		var nextIndex = index < projectsList.length ? index : (projectsList.length > 0 ? (projectsList.length - 1) : -1);
  		selectedProject = (nextIndex >= 0 ? projectsList[nextIndex] : undefined);
  		$rootScope.$broadcast('project:select');
  	}
  };
  var updateProject = function (project) {
  	var index = findProjectIndex(project);
  	if (index >= 0) {
  		projectsList[index] = project;
  	} else {
  		projectsList.unshift(project);
  	}

  	selectedProject = project;
  	$rootScope.$broadcast('project:select');
  };
  var showConfirmDialog = function (ev, title, content, confirm) {
      var dialog = $mdDialog.confirm()
        .title(title)
        .content(content)
        .ok('确认')
        .cancel('取消')
        .targetEvent(ev);
      $mdDialog.show(dialog).then(function() {
          confirm();
      }, function() {
        
      });
  };
  var showProjectDialog = function (ev, project) {
      $mdDialog.show({
        controller: function (scope, $mdDialog, $q, restService) {
            scope.project = angular.copy(project);
            scope.runningAction = false;

            scope.hide = function() {
              $mdDialog.hide();
            };
            scope.cancel = function() {
              $mdDialog.cancel();
            };
            scope.deleteProject = function (ev, project) {
            	showConfirmDialog(ev, '删除确认',
            		'确认要彻底删除项目 "' + project.name + '" , 删除后将不可恢复?', function () {
	              	var deferred = $q.defer();
      						restService.deleteProject(project._id, function (newProject) {
      							if (newProject) {
      								deferred.resolve(newProject);
      							} else {
      								deferred.reject();
      							}
      						}, function () {
      							scope.runningAction = true;
      						});

	              	deferred.promise.then(function (project) {
	              		deleteProject(project);
	              		scope.runningAction = false;
      							$mdDialog.cancel();
      						}, function (reason) {
      							scope.runningAction = false;
      						});
            		});
            };
            scope.newEditProject = function(result) {
            	var deferred = $q.defer();
            	if (result._id) {
      					restService.editProject(result, function (newProject) {
      						if (newProject) {
      							deferred.resolve(newProject);
      						} else {
      							deferred.reject();
      						}
      					}, function () {
                  scope.runningAction = true;
                });
            	} else {
      					restService.createProject(result, function (newProject) {
      						if (newProject) {
      							deferred.resolve(newProject);
      						} else {
      							deferred.reject();
      						}
      					}, function () {
                  scope.runningAction = true;
                });
            	}

            	deferred.promise.then(function (project) {
            		updateProject(project);
                scope.runningAction = false;
      					$mdDialog.hide();
      				}, function (reason) {
      					scope.runningAction = false;
      				});
            };
        },
        templateUrl: 'webapp/dash-board/project-dialog.html',
        targetEvent: ev,
      });
  };
  var showTaskDialog = function (ev, action, projectId) {
      $mdDialog.show({
        controller: function (scope, $mdDialog, $q, restService) {
            scope.runningAction = false;
            scope.hide = function() {
              $mdDialog.hide();
            };
            scope.cancel = function() {
              $mdDialog.cancel();
            };
            scope.createTask = function(task) {
              var deferred = $q.defer();
              task.actionId = action._id;
              restService.createTask(task, projectId, function (newTask) {
                if (newTask) {
                  deferred.resolve(newTask);
                } else {
                  deferred.reject();
                }
              }, function () {
                scope.runningAction = true;
              });

              deferred.promise.then(function (task) {
                syncProjectActiveTasks(projectId);
                scope.runningAction = false;
                $mdDialog.cancel();
              }, function (reason) {
                scope.runningAction = false;
              });
            };
        },
        templateUrl: 'webapp/detail-panel/edit-dialog.html',
        targetEvent: ev,
      });
  };
  var showTermainl = function (ev, task) {
      $mdDialog.show({
        controller: function (scope, $rootScope, $mdDialog) {
          var taskSocket = io();
          scope.hide = function() {
            $mdDialog.hide();
          };
          scope.cancel = function() {
            $mdDialog.cancel();
          };
          // scope.$on('terminal-input', function (e, consoleInput) {
          //     var cmd = consoleInput[0];
          //     socket.emit('userInput', {
          //       id: oldListenerId,
          //       cmd: cmd.command
          //     });
          //     $rootScope.$broadcast('secondary-command', {command: 'hidePrompt'});
          //     hidePrompt = true;
          // });
          taskSocket.on(task._id, function (command) {
            $rootScope.$broadcast('terminal-output', {
                output: true,
                text: [command],
                breakLine: true
            });
          });
        },
        templateUrl: 'webapp/detail-panel/terminal-dialog.html',
        targetEvent: ev,
      });
  };
  var syncProjectActiveTasks = function (projectId) {
    if (isCurrentProject(projectId)) {
      restService.syncActiveTasks(projectId, function (tasks) {
        if (isCurrentProject(projectId)) {
          tasks.forEach(function (task) {
            task.action = findAction(selectedProject.actions, task.actionId);
          });
          activeTaskList.length = 0;
          activeTaskList.push.apply(activeTaskList, tasks);
        }
      });
    }
  };
  var syncProjectHistoryTasks = function (projectId, next) {
    if (isCurrentProject(projectId)) {
      restService.syncHistoryTasks(projectId, next ? historyTaskList[historyTaskList.length - 1] : historyTaskList[0], next, function (tasks) {
        if (!tasks || tasks.length == 0) return;
        
        if (isCurrentProject(projectId)) {
          tasks.forEach(function (task) {
            task.action = findAction(selectedProject.actions, task.actionId);
          });
          historyTaskList.length = 0;
          historyTaskList.push.apply(historyTaskList, tasks);
        }
      });
    }
  };
  var deleteTask = function (ev, task) {
    var content;
    switch(task.state) {
      case 'Pennding': content = '任务"' + task.name + '"还没有执行，确认删除该任务？'; break;
      case 'Running': content = '任务"' + task.name + '"正在执行，确认停止并删除该任务？'; break;
      case 'Failed': content = '确认删除该任务 "' + task.name + '"？'; break;
    }
    showConfirmDialog(ev, '删除确认', content, function () {
        var deferred = $q.defer();
        restService.deleteTask(task._id, function (deletedItem) {
          if (deletedItem) {
            deferred.resolve(deletedItem);
          } else {
            deferred.reject();
          }
        }, function () {

        });

        deferred.promise.then(function (deletedItem) {
          syncProjectActiveTasks(deletedItem.project);
          $mdDialog.cancel();
        }, function (reason) {

        });
      });
  };
  var selectProject = function (project) {
    listenOnProject(selectedProject, project);

    selectedProject = project;
    activeTaskList.length = 0;
    historyTaskList.length = 0;
    syncProjectActiveTasks(project._id);
    syncProjectHistoryTasks(project._id, true);
    $rootScope.$broadcast('project:select');
  };
  var findAction = function (actions, actionId) {
    for (var index in actions) {
      var action = actions[index];
      if (action._id == actionId) {
        return action;
      }
    }
  }

	return {
    getActiveTaskList: function () {
      return activeTaskList;
    },
    getHistoryTaskList: function () {
      return historyTaskList;
    },
    historyNextPage: function () {
      syncProjectHistoryTasks(selectedProject._id, true);
    },
    historyPrevPage: function () {
      syncProjectHistoryTasks(selectedProject._id, false);
    },
		createProject: function (ev) {
			showProjectDialog(ev);
		},
		editProject: function (ev, project) {
			showProjectDialog(ev, project);
		},
		refreshProjects: function () {
			restService.syncProjects(function (projects) {
				if (projects) {
					projectsList.length = 0;
					projectsList.push.apply(projectsList, projects);
          if (!selectedProject) {
            selectProject(projects[0]);
          }
				}
			});
			return projectsList;
		},
		getSelectedProject: function () {
			return selectedProject;
		},
		selectProject: function (project) {
      selectProject(project);
		},
    createTask: function (ev, action, projectId) {
      showTaskDialog(ev, action, projectId);
    },
    deleteTask: function (ev, task) {
      deleteTask(ev, task);
    },
    showTermainl: function (ev, task) {
      showTermainl(ev, task);
    }
	};
});