var dataService = angular.module('backend-service');
dataService.factory('dataService', function ($rootScope, $mdDialog, $q, restService) {
	var projectsList = [];
  var activeTaskList = [];
  var historyTaskList = [];
  var selectedProject;

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
      					});
            	} else {
      					restService.createProject(result, function (newProject) {
      						if (newProject) {
      							deferred.resolve(newProject);
      						} else {
      							deferred.reject();
      						}
      					});
            	}

            	deferred.promise.then(function (project) {
            		updateProject(project);
      					$mdDialog.hide();
      				}, function (reason) {
      					
      				}, function (update) {
      				
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
  var syncProjectActiveTasks = function (projectId) {
    if (isCurrentProject(projectId)) {
      restService.syncActiveTasks(projectId, function (tasks) {
        if (isCurrentProject(projectId)) {
          activeTaskList.length = 0;
          activeTaskList.push.apply(activeTaskList, tasks);
        }
      });
    }
  };
  var syncProjectHistoryTasks = function (projectId) {
    if (isCurrentProject(projectId)) {
      restService.syncHistoryTasks(projectId, function (tasks) {
        if (isCurrentProject(projectId)) {
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

	return {
    getActiveTaskList: function () {
      return activeTaskList;
    },
    getHistoryTaskList: function () {
      return historyTaskList;
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
				}
			});
			return projectsList;
		},
		getSelectedProject: function () {
			return selectedProject;
		},
		selectProject: function (project) {
			selectedProject = project;
      activeTaskList.length = 0;
      historyTaskList.length = 0;
      syncProjectActiveTasks(project._id);
      syncProjectHistoryTasks(project._id);
			$rootScope.$broadcast('project:select');
		},
    createTask: function (ev, action, projectId) {
      showTaskDialog(ev, action, projectId);
    },
    deleteTask: function (ev, task) {
      deleteTask(ev, task);
    }
	};
});