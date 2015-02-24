var autotestApp = angular.module("autotestApp");

autotestApp.controller('uploaderController', [ '$scope', '$upload',
		function($scope, $upload) {
	$scope.$watch('files', function(files) {
		if (files) {
			$upload.upload({
			  url: '/api/report',
			  method: 'POST',
			  file: files
			});
		}
	});
	
} ]);