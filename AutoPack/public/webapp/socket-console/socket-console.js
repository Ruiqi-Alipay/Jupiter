var socketConsole = angular.module('socket-console', ['vtortola.ng-terminal']);

socketConsole.directive("socketConsole", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
      scope: true,
    	templateUrl: "webapp/socket-console/socket-console.html",
    	link: function (scope, element, attr) {
        var socket = io();
        var currentTask;

        scope.$on('terminal-input', function (e, consoleInput) {
            var cmd = consoleInput[0];
            socket.emit('userInput', {
              id: currentTask._id,
              cmd: cmd.command
            });
        });

        $rootScope.$on('task:selected', function (event, data) {
            currentTask = data;
        });
        $rootScope.$on('task:start', function (event, data) {
            currentTask = data;
            socket.on(data._id, function(data) {
              scope.$broadcast('terminal-output', {
                  output: true,
                  text: [data],
                  breakLine: true
              });
            });

            backendService.startTask(data._id, function (newData) {
                $rootScope.$broadcast('task:stateChange', newData);
            }, function (newData) {

            });
        });
	    }
  	};
});