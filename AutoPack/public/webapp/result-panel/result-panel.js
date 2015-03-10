var resultPanel = angular.module('result-panel', ['backend-service', 'ngMaterial']);

resultPanel.directive("resultPanel", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/result-panel/result-panel.html",
    	link: function (scope, element, attr) {

	    }
  	};
});