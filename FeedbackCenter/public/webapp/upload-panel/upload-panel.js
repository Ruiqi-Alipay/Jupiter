var uploadPanel = angular.module('upload-panel', ['backend-service', 'ngMaterial', 'angularFileUpload']);

uploadPanel.directive("uploadPanel", function($rootScope, $interval, $upload, backendService) {
  	return {
    	restrict: "E",
    	replace: true,
        scope: true,
    	templateUrl: "webapp/upload-panel/upload-panel.html",
    	link: function (scope, element, attr) {
          scope.progress = {
            running: false,
            mode: 'buffer'
          };

          var updateProgress = function (present, msg) {
              scope.progress.value = present;

              if (present == -1) {
                  scope.progress.running = false;
                  $rootScope.$broadcast('toast:show', msg);
              } else {
                  scope.progress.running = true;
                  if (present == 100) {
                    scope.progress.mode = 'indeterminate';
                    scope.progress.text = '';
                    scope.progress.message = '上传完成，数据创建中...'
                  } else {
                    scope.progress.mode = 'buffer';
                    scope.progress.text = present + '%';
                    scope.progress.message = '上传中...'
                  }
              }
          };

          scope.batchUpload = function (files) {
              if (!files || !files[0]) return;
              
              updateProgress(0);

              $upload.upload({
                url: './api/upload',
                method: 'POST',
                file: files[0]
              }).progress(function (evt) {
                  var present = parseInt(100.0 * evt.loaded / evt.total);
                  updateProgress(present);
              }).success(function (data, status, headers, config) {
                  updateProgress(-1, data.msg);
              }).error(function (data, status, headers, config) {
                  
              });
          };
	    }
  	};
});