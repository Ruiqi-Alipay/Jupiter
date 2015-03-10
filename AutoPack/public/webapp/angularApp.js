var app = angular.module('autopackApp', ['ngMaterial', 'socket-console', 'task-list', 'result-panel']);

app.controller("mainController", function($mdToast, $animate, $scope) {
    var showToast = function (text) {
        $mdToast.show(
          $mdToast.simple()
            .content(text)
            .position('bottom right')
            .hideDelay(3000)
        );
    };

    $scope.app = {
        showTerminal: true
    };

    $scope.$on('selectedchange', function (event, select) {
        if (select.task && select.task.state == 'Finiahed') {
            $scope.showTerminal = false;
        } else {
            $scope.showTerminal = true;
        }
    });
    
    $scope.$on('toast:show', function (event, text) {
        showToast(text);
    });
});