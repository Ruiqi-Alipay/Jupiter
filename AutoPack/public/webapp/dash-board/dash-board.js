var taskList = angular.module('task-list', ['backend-service', 'ngMaterial']);

taskList.directive("taskList", function($rootScope, $mdDialog, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/dash-board/dash-board.html",
    	link: function (scope, element, attr) {
            var refreshList = function () {
                backendService.getTasks(function(tasks) {
                    scope.todos = tasks;
                }, function(error) {

                });
            };
            var refreshProjects = function () {
                backendService.getProjects(function(projects) {
                    scope.projects = projects;
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

            var selectProject;

            scope.pannel = {
                page: 'project'
            };

            scope.onNewTask = function () {
                task.project = selectProject._id;
                backendService.newTask(function(task) {
                    refreshList();
                    $rootScope.$broadcast('toast:show', '新建任务成功，点击开始按钮开始执行');
                }, function(error) {
                    $rootScope.$broadcast('toast:show', '新建任务失败：' + error);
                });
            };
            scope.onItemClicked = function (item) {
                $rootScope.$broadcast('task:selected', item);
            };
            scope.onStartTask = function (item) {
                $rootScope.$broadcast('task:start', item);
            };
            scope.onDeleteTask = function (item) {
                backendService.deleteTask(item._id, function(data) {
                    refreshList();
                    $rootScope.$broadcast('toast:show', '删除成功');
                }, function(error) {
                    $rootScope.$broadcast('toast:show', '删除失败：' + error);
                });
            };
            scope.showCreateProejctDialog = function(ev) {
                showProjectDialog(ev);
            };
            scope.onEditProject = function (ev, project) {
                showProjectDialog(ev, project);
            };
            scope.onDeleteProject = function (project) {
                backendService.deleteProject(project._id, function(data) {
                    refreshProjects();
                    $rootScope.$broadcast('toast:show', '删除成功');
                }, function(error) {
                    $rootScope.$broadcast('toast:show', '删除失败：' + error);
                });
            };
            scope.onProjectClicked = function (project) {
                selectProject = project;
                scope.pannel.page = "task";
            };
            scope.onBack = function () {
                scope.pannel.page = "project";
            };

            refreshProjects();
	    }
  	};
});