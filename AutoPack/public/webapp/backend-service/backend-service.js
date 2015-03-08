var backendService = angular.module('backend-service', []);
backendService.factory('backendService', function ($http, $rootScope) {
	return {
		newTask: function (success, error) {
			$http.post('./api/task').success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		getTasks: function (projectId, success, error) {
			$http.get('./api/task/' + projectId).success(function(data){
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
		},
		newEditProject: function (project, success, error) {
			if (project._id) {
				$rootScope.$broadcast('toast:show', '工程修改中...');
				$http.post('./api/project/' + project._id, project).success(function(data){
					$rootScope.$broadcast('toast:show', '修改成功');
			    	success(data);
			  	}).error(function(data, status, headers, config) {
			  		$rootScope.$broadcast('toast:show', '修改失败：' + error);
			  		error(data);
			  	});
			} else {
				$rootScope.$broadcast('toast:show', '工程创建中...');
				$http.post('./api/project', project).success(function(data){
					$rootScope.$broadcast('toast:show', '创建成功');
			    	success(data);
			  	}).error(function(data, status, headers, config) {
			  		$rootScope.$broadcast('toast:show', '创建失败：' + error);
			  		error(data);
			  	});
			}
		},
		activeProject: function (project, success, error) {
			$http.get('./api/active/' + project._id).success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		getProjects: function (success, error) {
			$http.get('./api/project').success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		deleteProject: function (id, success, error) {
			$http.delete('./api/project/' + id).success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		}
	};
});