var taskList = angular.module('task-list', ['backend-service']);

taskList.directive("taskList", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/task-list/task-list.html",
    	link: function (scope, element, attr) {
            var refreshList = function () {
                backendService.getTasks(function(tasks) {
                    scope.todos = tasks;
                }, function(error) {

                });
            };

            scope.onNewTask = function () {
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

            refreshList();
	    }
  	};
});