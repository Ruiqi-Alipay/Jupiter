var backendService = angular.module('backend-service', []);
backendService.factory('backendService', function ($http) {
	return {
		newFeedback: function (data, success, error) {
			$http.post('./api/feedback', data).success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		}
	};
});