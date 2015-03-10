var taskList = angular.module('task-list', ['backend-service', 'ngMaterial']);

taskList.directive("taskList", function($rootScope, $mdDialog, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/dash-board/dash-board.html",
    	link: function (scope, element, attr) {
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
                        backendService.newEditProject(project);
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
                    backendService.deleteProject(item._id);
                }, function() {
                  
                });
            };

            scope.pannel = {
                page: 'project'
            };

            scope.onNewTask = function () {
                backendService.newTask(scope.selectProject._id, function(project) {
                    $rootScope.$broadcast('toast:show', '新建任务成功，点击开始按钮开始执行');
                }, function(error) {
                    $rootScope.$broadcast('toast:show', '新建任务失败：' + error);
                });
            };
            scope.onItemClicked = function (item) {
                $rootScope.$broadcast('task:selected', item);
                $rootScope.$broadcast('app:toggleTerminal', item.state != 'Finished');
            };
            scope.onStartTask = function (item) {
                $rootScope.$broadcast('task:selected', item);
                backendService.startTask(scope.selectProject._id, item._id);
            };
            scope.onDeleteTask = function (item) {
                backendService.deleteTask(scope.selectProject._id, item._id);
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
                backendService.activeProject(project);
            };
            scope.onProjectClicked = function (project) {
                backendService.selectProject(project);
                $rootScope.$broadcast('task:selected', project);
                $rootScope.$broadcast('app:toggleTerminal', true);
                scope.selectProject = project;
                if (project.state == 'Active') {
                    scope.pannel.page = "task";
                }
            };
            scope.onBack = function () {
                scope.pannel.page = "project";
            };

            scope.projects = backendService.getProjects();
	    }
  	};
});