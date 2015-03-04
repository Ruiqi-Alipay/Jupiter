var socketConsole = angular.module('socket-console', ['btford.socket-io']);

socketConsole.factory('backendSocket', function (socketFactory) {
  return socketFactory();
});

socketConsole.directive("socketConsole", function($rootScope, backendSocket) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/socket-console/socket-console.html",
    	link: function (scope, element, attr) {
    		backendSocket.on('message', function(data) {
                console.log(data);
            });

            $rootScope.$on('task:selected', function (event, data) {
                console.log(data);
            });
	    }
  	};
});