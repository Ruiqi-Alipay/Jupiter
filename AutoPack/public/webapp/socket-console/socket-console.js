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
        var hidePrompt = false;

        scope.$on('terminal-input', function (e, consoleInput) {
            var cmd = consoleInput[0];
            socket.emit('userInput', {
              id: currentListenKey,
              cmd: cmd.command
            });
            $rootScope.$broadcast('secondary-command', {command: 'hidePrompt'});
            hidePrompt = true;
        });

        $rootScope.$on('task:selected', function (event, item) {
            if (currentListenKey && item._id == currentListenKey) {
                return;
            }

            if (currentListenKey) {
              socket.removeAllListeners(currentListenKey);
            }
            currentListenKey = item._id;

            socket.on(currentListenKey, function(data) {
              if (hidePrompt) {
                  hidePrompt = false;
                  $rootScope.$broadcast('secondary-command', {command: 'showPrompt'});
              }
              if (data.indexOf('Project now is ready for pack!') >= 0) {
                  backendService.getProjects();
              } else if (data.indexOf('*** Build execution') >= 0) {
                  backendService.getProjectById(item._id);
              }
              scope.$broadcast('terminal-output', {
                  output: true,
                  text: [data],
                  breakLine: true
              });
            });

            $rootScope.$broadcast('terminal-command', {command: 'clear'})
        });
	    }
  	};
});