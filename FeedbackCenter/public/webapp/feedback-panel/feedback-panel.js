var feedbackPanel = angular.module('feedback-panel', ['backend-service']);

feedbackPanel.directive("feedbackPanel", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/feedback-panel/feedback-panel.html",
    	link: function (scope, element, attr) {
    		scope.onSubmit = function () {
    			backendService.newFeedback(scope.feedback, function (data) {
                    scope.feedback = data;
    				$rootScope.$broadcast('toast:show', '创建成功');
    			}, function (error) {
    				$rootScope.$broadcast('toast:show', '创建失败：' + error);
    			});
    		};
	    }
  	};
});