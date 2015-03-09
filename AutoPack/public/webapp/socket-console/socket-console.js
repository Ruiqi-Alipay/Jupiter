var socketConsole = angular.module('socket-console', ['vtortola.ng-terminal']);

socketConsole.directive("socketConsole", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
      scope: true,
    	templateUrl: "webapp/socket-console/socket-console.html",
    	link: function (scope, element, attr) {
        var socket = io();
        var currentListenKey;

        scope.$on('terminal-input', function (e, consoleInput) {
            var cmd = consoleInput[0];
            socket.emit('userInput', {
              id: currentListenKey,
              cmd: cmd.command
            });
        });

        $rootScope.$on('task:selected', function (event, data) {
            if (currentListenKey) {
              socket.removeAllListeners(currentListenKey);
            }
            currentListenKey = data._id;

            socket.on(currentListenKey, function(data) {
              if (data.indexOf('Project now is ready for pack!') >= 0) {
                  $rootScope.$broadcast('statechange:project');
              } else if (data.indexOf('Build jar execution finished!') >= 0) {
                  $rootScope.$broadcast('statechange:task');
              }
              scope.$broadcast('terminal-output', {
                  output: true,
                  text: [data],
                  breakLine: true
              });
            });
        });
	    }
  	};
});