var backendService = angular.module('backend-service', []);
backendService.factory('backendService', function ($http) {
	return {
		newTask: function (success, error) {
			$http.post('./api/task').success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		getTasks: function (success, error) {
			$http.get('./api/task').success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		startTask: function (taskId, success, error) {
			$http.get('./api/start/' + taskId).success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		deleteTask: function (taskId, success, error) {
			$http.delete('./api/task/' + taskId).success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		}
	};
});