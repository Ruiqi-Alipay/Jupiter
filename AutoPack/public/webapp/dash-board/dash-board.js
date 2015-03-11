var taskList = angular.module('dash-board', ['backend-service', 'ngMaterial']);

taskList.directive("dashBoard", function($rootScope, $mdDialog, dataService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/dash-board/dash-board.html",
    	link: function (scope, element, attr) {
            scope.createProject = function(ev) {
                dataService.createProject(ev);
            };
            scope.onProjectClicked = function (project) {
                dataService.selectProject(project);
            };

            scope.projects = dataService.refreshProjects();
	    }
  	};
});