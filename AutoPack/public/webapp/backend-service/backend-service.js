var backendService = angular.module('backend-service', []);
backendService.factory('backendService', function ($http, $rootScope) {
	var projectList = [];
	var findProject = function (projectId) {
		for (var index in projectList) {
			var item = projectList[index];
			if (item._id == projectId) {
				return item;
			}
		}
	};
	var updateProject = function (newProject) {
    	var project = findProject(newProject._id);
    	if (project) {
    		for (var key in newProject) {
    			project[key] = newProject[key];
    		}
    	} else {
    		projectList.unshift(newProject);
    	}
	};

	return {
		getProjects: function () {
			$http.get('./api/project').success(function(projects){
				projectList.length = 0;
				projectList.push.apply(projectList, projects);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '同步工程列表出错：' + error);
		  	});
			return projectList;
		},
		getTasks: function (projectId) {
			return findProject(projectId).tasks;
		},
		newTask: function (projectId) {
			$http.post('./api/project/' + projectId + '/task').success(function(data){
		    	updateProject(data);
		    	$rootScope.$broadcast('toast:show', '新建任务成功，点击开始按钮开始执行');
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '新建任务失败：' + error);
		  	});
		},
		startTask: function (projectId, taskId) {
			$http.get('./api/project/' + projectId + '/start/' + taskId).success(function(data){
		    	updateProject(data);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '执行任务失败：' + error);
		  	});
		},
		deleteTask: function (projectId, taskId) {
			$http.delete('./api/project/' + projectId + '/task/' + taskId).success(function(data){
		    	updateProject(data);
		    	$rootScope.$broadcast('toast:show', '删除成功');
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '删除失败：' + error);
		  	});
		},
		newEditProject: function (project) {
			if (project._id) {
				$rootScope.$broadcast('toast:show', '工程修改中...');
				$http.post('./api/project/' + project._id, project).success(function(data){
					updateProject(data);
					$rootScope.$broadcast('toast:show', '修改成功');
			  	}).error(function(error, status, headers, config) {
			  		$rootScope.$broadcast('toast:show', '修改失败：' + error);
			  	});
			} else {
				$rootScope.$broadcast('toast:show', '工程创建中...');
				$http.post('./api/project', project).success(function(data){
					updateProject(data);
					$rootScope.$broadcast('toast:show', '创建成功');
			  	}).error(function(error, status, headers, config) {
			  		$rootScope.$broadcast('toast:show', '创建失败：' + error);
			  	});
			}
		},
		activeProject: function (project) {
			$http.get('./api/project/' + project._id + '/active').success(function(data){
		    	updateProject(data);
		    	$rootScope.$broadcast('task:selected', project);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', 'Failed to active：' + error);
		  	});
		},
		getProjectById: function (projectId) {
			$http.get('./api/project/' + projectId).success(function(data){
		    	updateProject(data);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '更新项目失败：' + error);
		  	});
		},
		deleteProject: function (id) {
			$http.delete('./api/project/' + id).success(function(data){
		    	updateProject(data);
		    	$rootScope.$broadcast('toast:show', '删除成功');
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '删除失败：' + error);
		  	});
		}
	};
});