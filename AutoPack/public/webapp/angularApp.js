var app = angular.module('autopackApp', ['ngMaterial', 'socket-console', 'task-list']);

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

    $scope.$on('app:toggleTerminal', function (event, show) {
        $scope.app.showTerminal = show;
    });
    
    $scope.$on('toast:show', function (event, text) {
        showToast(text);
    });
});