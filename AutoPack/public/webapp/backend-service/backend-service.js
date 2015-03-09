var backendService = angular.module('backend-service', []);
backendService.factory('backendService', function ($http, $rootScope) {
	return {
		newTask: function (projectId, success, error) {
			$http.post('./api/project/' + projectId + '/task').success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		getTasks: function (projectId, success, error) {
			$http.get('./api/project/' + projectId + '/task').success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		startTask: function (projectId, taskId, success, error) {
			$http.get('./api/project/' + projectId + '/start/' + taskId).success(function(data){
		    	success(data);
		  	}).error(function(data, status, headers, config) {
		  		error(data);
		  	});
		},
		deleteTask: function (projectId, taskId, success, error) {
			$http.delete('./api/project/' + projectId + '/task/' + taskId).success(function(data){
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
			$http.get('./api/project/' + project._id + '/active').success(function(data){
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
		getProjectById: function (projectId, success, error) {
			$http.get('./api/project/' + projectId).success(function(data){
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