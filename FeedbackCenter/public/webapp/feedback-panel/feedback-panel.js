var feedbackPanel = angular.module('feedback-panel', ['backend-service']);

feedbackPanel.directive("feedbackPanel", function($rootScope, $window, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/feedback-panel/feedback-panel.html",
    	link: function (scope, element, attr) {
            scope.appInfo = {};
            
    		scope.onSubmit = function () {
                var info = scope.appInfo;
                scope.feedback.appInfo =
                    (info.appVersion ? info.appVersion : '') + ':' +
                    (info.osVersion ? info.osVersion : '') + ':' +
                    (info.device ? info.device : '') + ':' +
                    (info.city ? info.city : '') + ':' +
                    (info.network ? info.network : '') + ':' +
                    (info.screen ? info.screen : '') + ':' +
                    (info.ip ? info.ip : '') + ':' +
                    (info.module ? info.module : '') + ':' +
                    (info.browser ? info.browser : '') + ':' +
                    (info.micaddress ? info.micaddress : '') + ':';

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