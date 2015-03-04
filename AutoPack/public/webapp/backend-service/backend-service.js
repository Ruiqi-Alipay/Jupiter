var backendService = angular.module('backend-service', []);
backendService.factory('backendService', function ($http) {
	return {
		getTasks: function (success, error) {
			$http.get('./api/task').success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		}
	};
});