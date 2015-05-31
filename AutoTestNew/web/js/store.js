var Dispatcher = require('./dispatcher').dispatcher,
	Actions = require('./actions'),
	EventEmitter = require('events').EventEmitter,
	assign = require('object-assign'),
	serverApi = require('./server-api');

function findArrayIndex (items, id) {
	for (var index in items) {
		if (items[index].id == id) {
			return index;
		}
	}
}

var AUTH_STATE_WATCHER = 'AUTH_STATE_WATCHER',
	DASHBOARD_DATA_WATCHER = 'DASHBOARD_DATA_WATCHER';

var _penndingTransition,
	_authDatas = {},
	_scriptDatas = {},
	_scriptDetailDatas = {},
	_parameterDatas = {},
	_packageDatas = {},
	_reportDatas = {},
	_responseMessage;

var CentralStore = assign({}, EventEmitter.prototype, {

	addAuthListener: function (callback) {
		this.on(AUTH_STATE_WATCHER, callback);
	},
	removeAuthListener: function (callback) {
		this.removeListener(AUTH_STATE_WATCHER, callback);
	},
	addDashboardDataListener: function (callback) {
		this.on(DASHBOARD_DATA_WATCHER, callback);
	},
	removeDashboardDataListener: function (callback) {
		this.removeListener(DASHBOARD_DATA_WATCHER, callback);
	},

	getAuthData: function () {
		return _authDatas;
	},
	getScriptListData: function () {
		return _scriptDatas;
	},
	getScriptDetailData: function (folder, scriptId) {
		var currentScript = _scriptDetailDatas.script;

		if (scriptId == 'new') {
			if (!currentScript || currentScript.id || currentScript.folder != folder) {
				_scriptDetailDatas.script = {
					folder: folder,
					type: 'Script'
				};
			}
		} else {
			if (currentScript && currentScript.id != scriptId) {
				_scriptDetailDatas = {};
			}
		}

		return _scriptDetailDatas;
	},
	getParameterData: function () {
		return _parameterDatas;
	},
	getPackageData: function () {
		return _packageDatas;
	},
	getReportData: function () {
		return _reportDatas;
	},
	setScriptSearchText: function (searchText) {
		_scriptDatas.searchText = searchText;
		this.emit(DASHBOARD_DATA_WATCHER);
	},
	setParameterSearchText: function (searchText) {
		_parameterDatas.searchText = searchText;
		this.emit(DASHBOARD_DATA_WATCHER);
	},
	getResponseMessage: function (target) {
		if (_responseMessage && _responseMessage.target == target) {
			return _responseMessage.message;
		}
	},
	getPenndingTransition: function () {
		if (_penndingTransition) {
			var copy = {};
			$.extend(copy, _penndingTransition);
			_penndingTransition = undefined;
			return copy;
		}
	},
	clearScripts: function () {
		_scriptDatas.scripts = undefined;
	}
});

CentralStore.dispatchToken = Dispatcher.register(function (action) {
	switch (action.type){
		// Folder related
		case Actions.LOAD_FOLDERS:
			serverApi.loadFolders(function (resposne) {
				if (resposne.success) {
					_scriptDatas.folders = resposne.data;
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;
		case Actions.CREATE_FOLDER:
			serverApi.createFolder(action.data, function (response) {
				if (response.success) {
					_scriptDatas.folders.push(response.data);
					_scriptDatas.folders.sort(function (a, b) {
						if (a.title > b.title) {
							return 1;
						} else if (a.title < b.title) {
							return -1;
						} else {
							return 0;
						}
					});
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;
		case Actions.UPDATE_FOLDER:
			var data = this.data;
			serverApi.updateFolder(data.folder, data.title, function (response) {
				if (response.success) {
					var index = findArrayIndex(_scriptDatas.folders, data.id);
					if (index >= 0) {
						_scriptDatas.folders[index].title = data.title;
						CentralStore.emit(DASHBOARD_DATA_WATCHER);
					}
				}
			});
			break;
		case Actions.DELETE_FOLDER:
			serverApi.deleteFolder(action.data, function (response) {
				if (response.success) {
					var folders = _scriptDatas.folders;
					var index = findArrayIndex(folders, response.data.id);
					folders.splice(index, 1);
					if (folders.length >= 0) {
						if (index >= folders.length) {
							index = folders.length -1;
						}

						_penndingTransition = {
							name: 'dashboard',
							params: { section_id: 'script' },
							query: { select_folder: folders[index].id }
						};
					} else {
						_penndingTransition = {
							name: 'dashboard',
							params: { section_id: 'script' }
						};
					}
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;

		// Script list
		case Actions.LOAD_SCRIPTS:
			serverApi.loadScripts(action.data, function (response) {
				if (response.success) {
					_scriptDatas.scripts = response.data;
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;

		// Script detail
		case Actions.LOAD_SCRIPT:
			serverApi.loadScript(action.data, function (response) {
				if (response.success) {
					var data = response.data;
					_scriptDetailDatas = data;
					if (_responseMessage && _responseMessage.target != data.script.id) {
						_responseMessage = undefined;
					}
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;
		case Actions.LOAD_CONFIG_SCRIPTS:
			serverApi.loadConfigScripts(function (response) {
				if (response.success) {
					for (var key in response.data) {
						_scriptDetailDatas[key] = response.data[key];
					}
					CentralStore.emit(DASHBOARD_DATA_WATCHER);	
				}
			});
			break;
		case Actions.SAVE_SCRIPT:
			var script = _scriptDetailDatas.script;
			if (script.actions) {
				script.actions = JSON.stringify(script.actions);
			}
			if (script.parameters) {
				script.parameters = JSON.stringify(script.parameters);
			}

			if (!script.id) {
				serverApi.createScript(script, function (response) {
					if (response.success) {
						_penndingTransition = {
							name: 'dashboard',
							params: { section_id: 'script' },
							query: { select_folder: response.data.folder, select_script: response.data.id }
						};
						_responseMessage = {
							target: response.data.id,
							message: 'Create script success'
						};
					} else {
						_responseMessage = {
							target: 'new',
							message: 'Create script failed'
						};
					}
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				});
			} else {
				serverApi.updateScript(script, function (response) {
					if (response.success) {
						_scriptDetailDatas.script = response.data;
						_responseMessage = {
							target: script.id,
							message: 'Update script success'
						};
					} else {
						_responseMessage = {
							target: script.id,
							message: 'Update script failed'
						};
					}
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				});
			}
			break;
		case Actions.SAVE_SCRIPT_AS:
			var script = {};
			$.extend(script, _scriptDetailDatas.script);
			script.folder = action.data;
			serverApi.createScript(script, function (response) {
				if (response.success) {
					var data = response.data;
					_penndingTransition = {
						name: 'dashboard',
						params: { section_id: 'script' },
						query: { select_folder: data.folder, select_script: data.id }
					};
					_responseMessage = {
						target: data.id,
						message: 'Create script success'
					};
				} else {
					_responseMessage = {
						target: script.id,
						message: 'Create script failed'
					};
				}
				CentralStore.emit(DASHBOARD_DATA_WATCHER);
			});
			break;
		case Actions.DELETE_SCRIPT:
			var script = _scriptDetailDatas.script;
			serverApi.deleteScript(script.id, function (response) {
				if (response.success) {
					var folderScripts = _scriptDetailDatas.folderScripts;
					var index = findArrayIndex(folderScripts, script.id);
					folderScripts.splice(index, 1);
					if (folderScripts.length > 0) {
						if (index >= folderScripts.length) {
							index = folderScripts.length -1;
						}
						_penndingTransition = {
							name: 'dashboard',
							params: { section_id: 'script' },
							query: { select_folder: script.folder, select_script: folderScripts[index].id }
						};
					} else {
						_penndingTransition = {
							name: 'dashboard',
							params: { section_id: 'script' },
							query: { select_folder: script.folder, select_script: 'new' }
						};
					}
				} else {
					_responseMessage = {
						target: script.id,
						message: 'Delete script failed'
					};
				}
				CentralStore.emit(DASHBOARD_DATA_WATCHER);
			});
			break;
		case Actions.DETAIL_BASICINFO_UPDATE:
			var script = _scriptDetailDatas.script;
			for (var key in action.data) {
				script[key] = action.data[key];
			}
			CentralStore.emit(DASHBOARD_DATA_WATCHER);
			break;
		case Actions.DETAIL_PARAMETER_CREATE:
			if (!_scriptDetailDatas.script.parameters) {
				_scriptDetailDatas.script.parameters = [];
			}
			_scriptDetailDatas.script.parameters.push({
				name: '',
				value: ''
			});
			CentralStore.emit(DASHBOARD_DATA_WATCHER);
			break;
		case Actions.DETAIL_CONFIG_UPDATE:
			var script = _scriptDetailDatas.script;
			script.config = action.data;
			CentralStore.emit(DASHBOARD_DATA_WATCHER);
			break;
		case Actions.DETAIL_PARAMETER_UPDATE:
			var targetParameter = _scriptDetailDatas.script.parameters[action.data.index];
			delete action.data.index;
			for (var key in action.data) {
				targetParameter[key] = action.data[key];
			}
			CentralStore.emit(DASHBOARD_DATA_WATCHER);
			break;
		case Actions.DETAIL_PARAMETER_DELETE:
			_scriptDetailDatas.script.parameters.splice(action.data.index, 1);
			CentralStore.emit(DASHBOARD_DATA_WATCHER);
			break;
		case Actions.DETAIL_ACTION_CREATE:
			if (!_scriptDetailDatas.script.actions) {
				_scriptDetailDatas.script.actions = [];
			}
			_scriptDetailDatas.script.actions.splice(action.data.index, 0, {
				type: '点击',
				target: ''
			});
			CentralStore.emit(DASHBOARD_DATA_WATCHER);
			break;
		case Actions.DETAIL_ACTION_UPDATE:
			var targetAction = _scriptDetailDatas.script.actions[action.data.index];
			delete action.data.index;
			for (var key in action.data) {
				targetAction[key] = action.data[key];
			}
			CentralStore.emit(DASHBOARD_DATA_WATCHER);
			break;
		case Actions.DETAIL_ACTION_DELETE:
			_scriptDetailDatas.script.actions.splice(action.data.index, 1);
			CentralStore.emit(DASHBOARD_DATA_WATCHER);
			break;

		// Parameter related
		case Actions.LOAD_PARAMETERS:
			serverApi.loadParameters(function (response) {
				if (response.success) {
					_parameterDatas.parameters = response.data;
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;
		case Actions.CREATE_PARAMETER:
			var data = action.data;
			serverApi.createParameter(data.name, data.value, function (response) {
				if (response.success) {
					_parameterDatas.parameters.push(response.data);
					_parameterDatas.parameters.sort(function (a, b) {
						if (a.name > b.name) {
							return 1;
						} else if (a.name < b.name) {
							return -1;
						} else {
							return 0;
						}
					});
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;
		case Actions.UPDATE_PARAMETER:
			var data = action.data;
			serverApi.updateParameter(data.id, data.value, function (response) {
				if (response.success) {
					var index = findArrayIndex(_parameterDatas.parameters, data.id);
					if (index >= 0) {
						var parameter = _parameterDatas.parameters[index];
						parameter.value = data.value;
						CentralStore.emit(DASHBOARD_DATA_WATCHER);
					}
				}
			});
			break;
		case Actions.DELETE_PARAMETER:
			serverApi.deleteParameter(action.data, function (response) {
				if (response.success) {
					var index = findArrayIndex(_parameterDatas.parameters, action.data);
					if (index >= 0) {
						_parameterDatas.parameters.splice(index, 1);
						CentralStore.emit(DASHBOARD_DATA_WATCHER);
					}
				}
			});
			break;

		// Package
		case Actions.LOAD_PACKAGES:
			serverApi.loadPackages(function (response) {
				if (response.success) {
					_packageDatas.packages = response.data;
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;
		case Actions.UPLOAD_PACKAGE:
			var data = action.data;
			serverApi.uploadPackage(data.file, data.description, function (response) {
				if (response.target.response) {
					var response = JSON.parse(response.target.response);
					if (response.success) {
						_packageDatas.packages.push(response.data);
						_packageDatas.packages.sort(function (a, b) {
							if (a.name > b.name) {
								return 1;
							} else if (a.name < b.name) {
								return -1;
							} else {
								return 0;
							}
						});
						CentralStore.emit(DASHBOARD_DATA_WATCHER);
					}
				}
			});
			break;
		case Actions.DELETE_PACKAGE:
			serverApi.deletePackage(action.data, function (response) {
				if (response.success) {
					var index = findArrayIndex(_packageDatas.packages, action.data);
					if (index >= 0) {
						_packageDatas.packages.splice(index, 1);
						CentralStore.emit(DASHBOARD_DATA_WATCHER);
					}
				}
			});
			break;

		// Report related
		case Actions.SEARCH_REPORT:
			serverApi.searchReport(action.data, function (response) {
				if (response.success) {
					_reportDatas.reports = response.data;
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;
		case Actions.LOAD_REPORTS:
			serverApi.loadReports(action.data, function (response) {
				if (response.success) {
					var data = response.data;
					_reportDatas.reports = data.reports;
					_reportDatas.totalPage = data.totalPage;
					_reportDatas.currentPage = data.currentPage;
					CentralStore.emit(DASHBOARD_DATA_WATCHER);
				}
			});
			break;

		// Authentiction
		case Actions.AUTH_CHANGE:
			for (var key in action.data) {
				_authDatas[key] = action.data[key];
			}
			_authDatas.errorMsg = '';
			CentralStore.emit(AUTH_STATE_WATCHER);
			break;
		case Actions.AUTH_SIGNIN:
			_authDatas.loading = true;
			CentralStore.emit(AUTH_STATE_WATCHER);

			serverApi.login(_authDatas.username, _authDatas.password, function (response) {
				if (response.success) {
					localStorage.loginToken = response.token;
				} else {
					_authDatas.errorMsg = 'username or password not correct!';
				}
				_authDatas.loading = false;
				CentralStore.emit(AUTH_STATE_WATCHER);
			});
			break;
	}
});

module.exports = CentralStore;







