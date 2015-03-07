var feedbackPanel = angular.module('feedback-panel', ['backend-service']);

feedbackPanel.directive("feedbackPanel", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/feedback-panel/feedback-panel.html",
    	link: function (scope, element, attr) {
            scope.appInfo = {};
            scope.running = false;
            
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

                scope.running = true;
                $rootScope.$broadcast('toast:show', '反馈创建中...');
    			backendService.newFeedback(scope.feedback, function (msg) {
                    scope.running = false;
    				$rootScope.$broadcast('toast:show', msg);
    			});
    		};
	    }
  	};
});