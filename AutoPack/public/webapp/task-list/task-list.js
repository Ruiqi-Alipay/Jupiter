var taskList = angular.module('task-list', ['backend-service']);

taskList.directive("taskList", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/task-list/task-list.html",
    	link: function (scope, element, attr) {
            backendService.getTasks(function(tasks) {
                scope.todos = tasks;
            }, function(error) {

            });

            scope.onItemClicked = function (item) {
                $rootScope.$broadcast('task:selected', item);
            };
            scope.onStartTask = function (item) {
                $rootScope.$broadcast('task:start', item);
            }
	    }
  	};
});