var dataService = angular.module('backend-service');
dataService.factory('dataService', function ($rootScope) {
    var projects = [{
    	name: '国际支付SDK-Android',
    	description: '在外观设计上，新的12英寸MacBook与此前曝光的造型基本相同，增加了金色机身的外观设计也非常符合苹果当下的设计趋势。据悉新的12英寸MacBook机身重量仅仅为2磅（约907g），厚度仅仅为13.1mm，甚至比MacBook Air还薄24%。从数据上看这无疑是苹果史上最轻薄的MacBook产品。',
	    actions: [
	    	{name: '打包framework和Demo，并自动重新安装Demo'},
	    	{name: '打包framework和Demo，混淆代码不删除日志，并自动重新安装Demo'},
	    	{name: '打包framework和Demo，混淆代码并删除日志，并自动重新安装Demo'},
	    	{name: '打包framework和Demo，不混淆代码包含日志'},
	    	{name: '打包framework和Demo，并混淆代码不删除日志'},
	    	{name: '打包framework和Demo，并混淆代码删除日志'},
	    	{name: '打包framework，不混淆代码包含日志'},
	    	{name: '打包framework，并混淆代码不删除日志'},
	    	{name: '打包framework，并混淆代码删除日志'}	],
	    penndingTasks: [],
	    historyTasks: []
    }];
	return {
		getSelectedProject: function () {
			return projects[0];
		}
	};
});