var taskList = angular.module('task-list', ['backend-service', 'ngMaterial']);

taskList.directive("taskList", function($rootScope, $mdDialog, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/dash-board/dash-board.html",
    	link: function (scope, element, attr) {
            var updateTasks = function (project) {
                if (project._id == selectProject._id) {
                    scope.projectTasks = project.tasks;
                }
            };
            var refreshProjects = function () {
                backendService.getProjects(function(projects) {
                    scope.projects = projects;
                }, function(error) {

                });
            };
            var refreshProjectById = function (projectId) {
                backendService.getProjectById(projectId, function(project) {
                    updateTasks(project);
                }, function(error) {

                });
            };
            var showProjectDialog = function (ev, project) {
                $mdDialog.show({
                  controller: function (scope, $mdDialog) {
                      scope.project = angular.copy(project);

                      scope.hide = function() {
                        $mdDialog.hide();
                      };
                      scope.cancel = function() {
                        $mdDialog.cancel();
                      };
                      scope.newEditProject = function(project) {
                        backendService.newEditProject(project, function (data) {
                            $rootScope.$broadcast('task:selected', data);
                            refreshProjects();
                        }, function (error) {
                          
                        });
                        $mdDialog.hide();
                      };
                  },
                  templateUrl: 'webapp/dash-board/project-dialog.html',
                  targetEvent: ev,
                });
            };
            var showConfirmDialog = function (ev, item) {
                var confirm = $mdDialog.confirm()
                  .title('删除确认')
                  .content('确认要彻底删除项目 "' + item.name + '" , 删除后将不可恢复?')
                  .ariaLabel('删除')
                  .ok('删除')
                  .cancel('取消')
                  .targetEvent(ev);
                $mdDialog.show(confirm).then(function() {
                    backendService.deleteProject(item._id, function(data) {
                        refreshProjects();
                        $rootScope.$broadcast('toast:show', '删除成功');
                    }, function(error) {
                        $rootScope.$broadcast('toast:show', '删除失败：' + error);
                    });
                }, function() {
                  
                });
            };

            var selectProject;

            scope.pannel = {
                page: 'project'
            };

            $rootScope.$on('statechange:project', function () {
                refreshProjects();
            });
            $rootScope.$on('statechange:task', function () {
                if (selectProject) {
                    refreshProjectById(selectProject._id);
                }
            });

            scope.onNewTask = function () {
                backendService.newTask(selectProject._id, function(project) {
                    updateTasks(project);
                    $rootScope.$broadcast('toast:show', '新建任务成功，点击开始按钮开始执行');
                }, function(error) {
                    $rootScope.$broadcast('toast:show', '新建任务失败：' + error);
                });
            };
            scope.onItemClicked = function (item) {
                $rootScope.$broadcast('task:selected', item);
            };
            scope.onStartTask = function (item) {
                $rootScope.$broadcast('task:selected', item);
                backendService.startTask(selectProject._id, item._id, function (project) {
                    updateTasks(project);
                }, function (newData) {

                });
            };
            scope.onDeleteTask = function (item) {
                backendService.deleteTask(selectProject._id, item._id, function(project) {
                    $rootScope.$broadcast('toast:show', '删除成功');
                    updateTasks(project);
                }, function(error) {
                    $rootScope.$broadcast('toast:show', '删除失败：' + error);
                });
            };
            scope.showCreateProejctDialog = function(ev) {
                showProjectDialog(ev);
            };
            scope.showConfirmDialog = function(ev, item) {
                showConfirmDialog(ev, item);
            };
            scope.onEditProject = function (ev, project) {
                showProjectDialog(ev, project);
            };
            scope.onActiveProject = function (ev, project) {
                backendService.activeProject(project, function(data) {
                    refreshProjects();
                    $rootScope.$broadcast('task:selected', project);
                }, function(error) {
                    $rootScope.$broadcast('toast:show', 'Failed to active：' + error);
                });
            };
            scope.onProjectClicked = function (project) {
                if (project.state == 'Active') {
                    selectProject = project;
                    scope.pannel.page = "task";
                    $rootScope.$broadcast('task:selected', project);
                    updateTasks(project);
                }
            };
            scope.onBack = function () {
                scope.pannel.page = "project";
            };

            refreshProjects();
	    }
  	};
});