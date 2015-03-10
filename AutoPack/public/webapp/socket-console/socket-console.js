var socketConsole = angular.module('socket-console', ['vtortola.ng-terminal']);

socketConsole.directive("socketConsole", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
      scope: true,
    	templateUrl: "webapp/socket-console/socket-console.html",
    	link: function (scope, element, attr) {
        scope.$on('terminal-input', function (e, consoleInput) {
            var cmd = consoleInput[0];
            backendService.socketInput(cmd.command);
        });
	    }
  	};
});