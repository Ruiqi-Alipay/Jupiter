var resultPanel = angular.module('result-panel', ['backend-service', 'ngMaterial']);

resultPanel.directive("resultPanel", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/result-panel/result-panel.html",
    	link: function (scope, element, attr) {
	        scope.$on('task:selected', function (event, item) {
	            scope.task = item;
	        });

	        scope.download = function (item) {
	        	var project = backendService.getSelectedProject();
				var href = 'http://autotest.d10970aqcn.alipay.net/autopack/download/' + project._id.toString() + '/' + scope.task._id.toString() + '/' + item;
				var pom = document.createElement('a');
				pom.setAttribute('href', href);
				pom.click();
	        }
	    }
  	};
});