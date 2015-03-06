var uploadPanel = angular.module('upload-panel', ['backend-service', 'ngMaterial', 'angularFileUpload']);

uploadPanel.directive("uploadPanel", function($rootScope, $interval, $upload, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/upload-panel/upload-panel.html",
    	link: function (scope, element, attr) {
          scope.progress = {};

          var updateProgress = function (present) {
              scope.progress.value = present;
              scope.progress.text = present + '%';
              if (present == 100) {
                  scope.progress.message = '上传成功';
              } else {
                  scope.progress.message = '上传中...'
              }
          };

          scope.batchUpload = function (files) {
              updateProgress(0);

              $upload.upload({
                url: './api/upload',
                method: 'POST',
                file: files[0]
              }).progress(function (evt) {
                  var present = parseInt(100.0 * evt.loaded / evt.total);
                  updateProgress(present);
              }).success(function (data, status, headers, config) {
                  updateProgress(100);
              }).error(function (data, status, headers, config) {
                  
              });
          };
	    }
  	};
});