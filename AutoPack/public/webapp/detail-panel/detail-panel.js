var detailPanel = angular.module('detail-panel', ['backend-service', 'ngMaterial']);

detailPanel.directive("detailPanel", function($rootScope, $mdDialog, dataService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/detail-panel/detail-panel.html",
    	link: function (scope, element, attr) {
            var showTaskDialog = function (ev, action) {
                $mdDialog.show({
                  controller: function (scope, $mdDialog, dataService) {
                      scope.hide = function() {
                        $mdDialog.hide();
                      };
                      scope.cancel = function() {
                        $mdDialog.cancel();
                      };
                      scope.newTask = function(name) {
                        $mdDialog.hide();

                        var project = dataService.getSelectedProject();
                        project.penndingTasks.push({
                        	name: name,
                        	actionName: action.name,
                        	date: new Date()
                        });
                      };
                  },
                  templateUrl: 'webapp/detail-panel/edit-dialog.html',
                  targetEvent: ev,
                });
            };

		    scope.panel = {
		    	tab1: '工程详情',
		    	tab2: '打包队列',
		    	tab3: '打包历史',
		    	selectedIndex: 0
		    };

		    scope.project = dataService.getSelectedProject();
		    scope.showTaskDialog = function (event, action) {
		    	showTaskDialog(event, action);
		    }
	    }
  	};
});