var socketConsole = angular.module('socket-console', ['vtortola.ng-terminal']);

socketConsole.directive("socketConsole", function($rootScope, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
      scope: true,
    	templateUrl: "webapp/socket-console/socket-console.html",
    	link: function (scope, element, attr) {
        var socket = io();
    var listen = function (listenId) {
        if (listenId == oldListenerId) {
            return;
        }

        if (oldListenerId) {
            socket.removeAllListeners(oldListenerId);
        }
        oldListenerId = listenId;

        socket.on(listenId, function(data) {
          if (hidePrompt) {
            $rootScope.$broadcast('secondary-command', {command: 'showPrompt'});
            hidePrompt = false;
          }
          if (data.indexOf('Project now is ready for pack!') >= 0) {
              refreshProjects();
          } else if (data.indexOf('*** Build execution') >= 0) {
              refreshTask(selectedProject, selectedTask);
          }
          $rootScope.$broadcast('terminal-output', {
              output: true,
              text: [data],
              breakLine: true
          });
        });
    };
    var socketInput = function (command) {
            socket.emit('userInput', {
              id: oldListenerId,
              cmd: command
            });
            $rootScope.$broadcast('secondary-command', {command: 'hidePrompt'});
            hidePrompt = true;
    };
        scope.$on('terminal-input', function (e, consoleInput) {
            var cmd = consoleInput[0];
            backendService.socketInput(cmd.command);
        });
	    }
  	};
});