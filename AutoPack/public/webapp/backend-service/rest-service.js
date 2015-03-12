var backendService = angular.module('backend-service', ['ngMaterial']);
backendService.factory('restService', function ($http, $rootScope) {
	return {
		syncProjects: function (finished, start) {
			$http.get('./api/project').success(function(projects){
				finished(projects);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '同步工程列表出错：' + error);
		  		finished();
		  	});
		  	if (start) start();
		},
		createProject: function (project, finished, start) {
			$http.post('./api/project', project).success(function(project){
				$rootScope.$broadcast('toast:show', '创建成功');
				finished(project);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '创建失败：' + error);
		  		finished();
		  	});
		  	if (start) start();
		},
		editProject: function (project, finished, start) {
			$http.post('./api/project/' + project._id, project).success(function(project){
				$rootScope.$broadcast('toast:show', '修改成功');
				finished(project);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '修改失败：' + error);
		  		finished();
		  	});
		  	if (start) start();
		},
		deleteProject: function (id, finished, start) {
			$http.delete('./api/project/' + id).success(function(project){
		    	$rootScope.$broadcast('toast:show', '删除成功');
		    	finished(project);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '删除失败：' + error);
		  		finished();
		  	});
		  	if (start) start();
		},
		createTask: function (task, projectId, finished, start) {
			$http.post('./api/task/' + projectId, task).success(function(task){
		    	$rootScope.$broadcast('toast:show', '新建任务已添加到执行队列');
		    	finished(task);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '新建任务失败：' + error);
		  		finished();
		  	});
		  	if (start) start();
		},
		deleteTask: function (taskId, finished, start) {
			$http.delete('./api/task/' + taskId).success(function(task){
		    	$rootScope.$broadcast('toast:show', '删除成功');
		    	finished(task);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '删除失败：' + error);
		  		finished();
		  	});
		  	if (start) start();
		},
		syncActiveTasks: function (projectId, finished, start) {
			$http.get('./api/task/active?project=' + projectId).success(function(tasks){
				finished(tasks);
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '同步任务列表出错：' + error);
		  		finished();
		  	});
		  	if (start) start();
		},
		syncHistoryTasks: function (projectId, starterTask, orlder, finished, start) {
			var pagePrarm = '';
			if (starterTask) {
				pagePrarm = '&' + (orlder ? 'next=' : 'prev=') + encodeURIComponent(starterTask.date);
			}
			$http.get('./api/task/history?project=' + projectId + pagePrarm).success(function(tasks){
				finished(tasks);

				if (starterTask && tasks.length == 0) {
					$rootScope.$broadcast('toast:show', orlder ? '已经没有更多历史记录' : '已是最新记录');
				}
		  	}).error(function(error, status, headers, config) {
		  		$rootScope.$broadcast('toast:show', '同步历史任务出错：' + error);
		  		finished();
		  	});
		  	if (start) start();
		}
	};
});