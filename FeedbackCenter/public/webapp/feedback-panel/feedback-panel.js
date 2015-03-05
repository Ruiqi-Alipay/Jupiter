var feedbackPanel = angular.module('feedback-panel', []);

feedbackPanel.directive("feedbackPanel", function($rootScope) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/feedback-panel/feedback-panel.html",
    	link: function (scope, element, attr) {
    		scope.onSubmit = function () {
    			$rootScope.$broadcast('toast:show', '...');
    		};
	    }
  	};
});