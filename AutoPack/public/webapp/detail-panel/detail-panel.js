var detailPanel = angular.module('detail-panel', ['backend-service', 'ngMaterial']);

detailPanel.directive("detailPanel", function($rootScope, $mdDialog, dataService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/detail-panel/detail-panel.html",
    	link: function (scope, element, attr) {
        scope.$on('project:select', function (event) {
          scope.project = dataService.getSelectedProject();
        });

		    scope.panel = {
		    	tab1: '工程详情',
		    	tab2: '打包队列',
		    	tab3: '打包历史',
		    	selectedIndex: 0
		    };
        scope.activeTasks = dataService.getActiveTaskList();
        scope.historyTasks = dataService.getHistoryTaskList();

        scope.editProject = function (ev, project) {
          dataService.editProject(ev, project)
        }
		    scope.createTask = function (event, action) {
		    	dataService.createTask(event, action, scope.project._id);
		    }
        scope.deleteTask = function (event, task) {
          dataService.deleteTask(event, task);
        }
        scope.openTerminal = function (task) {
          // body...
        }
	    }
  	};
});