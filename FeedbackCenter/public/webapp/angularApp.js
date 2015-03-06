var app = angular.module('feedbackApp', ['ngMaterial', 'feedback-panel', 'upload-panel']);

app.controller("toastController", function($mdToast, $animate, $scope) {
    var showToast = function (text) {
        $mdToast.show(
          $mdToast.simple()
            .content(text)
            .position('bottom right')
            .hideDelay(3000)
        );
    };
    
    $scope.$on('toast:show', function (event, text) {
        showToast(text);
    });
});