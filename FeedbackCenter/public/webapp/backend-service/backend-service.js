var backendService = angular.module('backend-service', []);
backendService.factory('backendService', function ($http) {
	return {
		newFeedback: function (data, finished) {
			$http.post('./api/feedback', data).success(function(data){
				finished(data.msg);
		  	}).error(function(data, status, headers, config) {
		  		finished(data);
		  	});
		}
	};
});