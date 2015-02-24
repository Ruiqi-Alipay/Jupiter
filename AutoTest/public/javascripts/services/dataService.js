var autotestApp = angular.module("autotestApp");

autotestApp.factory("dataService", function($rootScope, $timeout, $http) {
	var scriptByFolderId = {};
	var folderIdToTitle;
	var folderList = [];
	var configScripts = [];

	var selectScriptFolder;
	var selectScriptIndex;
	var selectReport;

	var findItemPosition = function(data) {
		var scriptList = scriptByFolderId[data.folder];
		if (scriptList) {
			for (var index in scriptList) {
				if (scriptList[index]._id == data._id) {
					return {
						folderId: data.folder,
						index: index
					}
				}
			}
		}
	};

	var sortScritps = function(sortType) {
		for (var key in scriptByFolderId) {
			var itemList = scriptByFolderId[key];
			scriptByFolderId[key] = itemList.sort(function(obj1, obj2) {
				if (sortType === '首字母 A-Z') {
					if (obj1.title == obj2.title) {
						return 0;
					} else if (obj1.title > obj2.title) {
						return 1;
					} else {
						return -1;
					}
				} else if (sortType === '首字母 Z-A') {
					if (obj1.title == obj2.title) {
						return 0;
					} else if (obj1.title > obj2.title) {
						return -1;
					} else {
						return 1;
					}
				} else if (sortType === '最近跟新') {
					if (obj1.date == obj2.date) {
						return 0;
					} else if (obj1.date > obj2.date) {
						return -1;
					} else {
						return 1;
					}
				} else if (sortType === '最久更新') {
					if (obj1.date == obj2.date) {
						return 0;
					} else if (obj1.date > obj2.date) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		}
	};

	var refreshScripts = function(callback) {
		$http.get('./api/testscriptfolder').success(function(serverFolders) {
			folderIdToTitle = {};
			configScripts.length = 0;
			folderList.length = 0;
			serverFolders = serverFolders.sort(function(obj1, obj2) {
				if (obj1.title == obj2.title) {
					return 0;
				} else if (obj1.title > obj2.title) {
					return 1;
				} else {
					return -1;
				}
			});
			serverFolders.forEach(function(value) {
				folderList.push(value);
			});
			folderList.push({title: '未分组', _id: 'UNFORDERED'});
			folderList.forEach(function(folder) {
				if (folder._id in scriptByFolderId) {
					scriptByFolderId[folder._id].length = 0;
				} else {
					scriptByFolderId[folder._id] = [];
				}
				folderIdToTitle[folder._id] = folder.title;
			});

			$http.get('./api/testscript').success(function(scriptList) {
				scriptList.forEach(function(script) {
					var date = new Date(script.date);
					script.readableDate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes();
					if (script.folder in scriptByFolderId) {
						scriptByFolderId[script.folder].push(script);
					} else {
						scriptByFolderId['UNFORDERED'].push(script);
					}
					if (script.type === 'Config') {
						configScripts.push(script);
					}
				});
				sortScritps('首字母 A-Z');

				if (callback) {
					callback();
				}
			});
		});
	};

	refreshScripts();

	return {
		getFolderIdToTitleMap: function() {
			return folderIdToTitle;
		},
		getScriptFolderMap: function() {
			return scriptByFolderId;
		},
		getConfigScripts: function() {
			return configScripts;
		},
		getFolderList: function() {
			return folderList;
		},
		selectReport: function(report) {
			selectReport = report;
		},
		getSelectReport: function() {
			return selectReport;
		},
		getServerReport: function(success, failed) {
			$http.get('./api/testreport').success(success);
		},
		getServerApps: function(success, failed) {
			$http.get('./api/testapp').success(success);
		},
		getServerScriptById: function(id, success) {
			$http.get('./api/testscript/' + id).success(success);
		},
		getSelectScript: function() {
			if (selectScriptFolder && selectScriptIndex >= 0) {
				return scriptByFolderId[selectScriptFolder][selectScriptIndex];
			}
		},
		getNextScript: function() {
			if (selectScriptFolder) {
				if (scriptByFolderId[selectScriptFolder].length > selectScriptIndex + 1) {
					return {
						folderId: selectScriptFolder,
						index: selectScriptIndex + 1
					};
				} else {
					var itemIndex;
					for (var index in folderList) {
						if (folderList[index]._id == selectScriptFolder) {
							itemIndex = index;
							break;
						}
					}
					while (itemIndex < folderList.length - 1) {
						itemIndex++;
						var itemId = folderList[itemIndex]._id;
						if (scriptByFolderId[itemId].length > 0) {
							return {
								folderId: itemId,
								index: 0
							};
						}
					}
				}
			}
		},
		getPreviousScript: function() {
			if (selectScriptFolder) {
				if (selectScriptIndex > 0) {
					return {
						folderId: selectScriptFolder,
						index: selectScriptIndex - 1
					};
				} else {
					var itemIndex;
					for (var index in folderList) {
						if (folderList[index]._id == selectScriptFolder) {
							itemIndex = index;
							break;
						}
					}
					while (itemIndex > 0) {
						itemIndex--;
						var itemId = folderList[itemIndex]._id;
						if (scriptByFolderId[itemId].length > 0) {
							return {
								folderId: itemId,
								index: scriptByFolderId[itemId].length - 1
							};
						}
					}
				}
			}
		},
		setSelectScript: function(folderId, index) {
			selectScriptFolder = folderId;
			selectScriptIndex = index;
		},
		deleteScript: function(folderId, index) {
			var deleteItem = scriptByFolderId[folderId][index];
			$http.delete('./api/testscript/' + deleteItem._id).success(function(data){
				refreshScripts();
	  		});
		},
		deleteReport: function(report, success) {
			$http.delete('./api/testreport/' + report._id).success(success);
		},
		downloadScript: function(folderId, index) {
			var script = scriptByFolderId[folderId][index];
			var extention = script.type === 'Script' ? '.json' : '.config';
			var pom = document.createElement('a');
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(script.content));
			pom.setAttribute('download', script.title + ".json");
			pom.click();
		},
		downloadReport: function(index) {
			var selectReport = serverReports[index];
			var pom = document.createElement('a');
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(selectReport.content));
			pom.setAttribute('download', selectReport.title + ".json");
			pom.click();
		},
		getReportData: function(file, index, callback) {
			$http.get('./api/reportdata?file=' + encodeURIComponent(file) + '&index=' + index).success(callback);
		},
		serverDataChanges: function() {
			refreshScripts();
		},
		newEditFolder: function(folder) {
			$http.post(folder._id ? './api/testscriptfolder/' + folder._id : './api/testscriptfolder', folder).success(function(data){
		    	refreshScripts();
		    	$rootScope.$broadcast('toastMessage', '保存成功');
		  	}).error(function(data, status, headers, config) {
		  		$rootScope.$broadcast('toastMessage', '保存失败：' + data);
		  	});
		},
		deleteFolder: function(folder) {
			$http.delete('./api/testscriptfolder/' + folder._id).success(function(data){
				refreshScripts();
	  		});
		},
		saveScript: function(script, saveType, callback) {
			$rootScope.$broadcast('toastMessage', '保存中...');
			var saveItem = {};
			var selectScript = this.getSelectScript();
			if (selectScript && saveType != '另存为') {
				jQuery.extend(saveItem, selectScript);
			}

			saveItem.title = script.title;
			saveItem.type = script.type;
			saveItem.folder = script.folder;
			saveItem.content = JSON.stringify(script);

			$http.post(saveItem._id ? './api/testscript/' + saveItem._id : './api/testscript', saveItem).success(function(data){
		    	refreshScripts(function() {
			    	callback(findItemPosition(data));
			    	$rootScope.$broadcast('toastMessage', '保存成功');
		    	});
		  	}).error(function(data, status, headers, config) {
		  		$rootScope.$broadcast('toastMessage', '保存失败：' + data);
		  	});
		},
		sortScriptList: function(sortType) {
			sortScritps(sortType);
		}
	};
});