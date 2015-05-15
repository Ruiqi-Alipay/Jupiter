var Dispatcher = require('flux').Dispatcher,
	Actions = require('./actions'),
	dispatcher = new Dispatcher();

module.exports = {
	dispatcher: dispatcher,
	utils: {
		// Folder
		createFolder: function (data) {
			dispatcher.dispatch({
				type: Actions.CREATE_FOLDER,
				data: data
			});
		},
		updateFolder: function (data) {
			dispatcher.dispatch({
				type: Actions.UPDATE_FOLDER,
				data: data
			});
		},
		deleteFolder: function (data) {
			dispatcher.dispatch({
				type: Actions.DELETE_FOLDER,
				data: data
			});
		},
		searchFolder: function (data) {
			Dispatcher.dispatch({
				type: Actions.SEARCH_FOLDER,
				data: data
			});
		},
		loadFolders: function () {
			dispatcher.dispatch({
				type: Actions.LOAD_FOLDERS
			});
		},

		// Scripts
		loadScripts: function (data) {
			dispatcher.dispatch({
				type: Actions.LOAD_SCRIPTS,
				data: data
			});
		},
		loadConfigScripts: function () {
			dispatcher.dispatch({
				type: Actions.LOAD_CONFIG_SCRIPTS
			});
		},
		loadScript: function (data) {
			dispatcher.dispatch({
				type: Actions.LOAD_SCRIPT,
				data: data
			});
		},
		saveScript: function () {
			dispatcher.dispatch({
				type: Actions.SAVE_SCRIPT
			});
		},
		saveScriptAs: function (folder) {
			dispatcher.dispatch({
				type: Actions.SAVE_SCRIPT_AS,
				data: folder
			});
		},
		deleteScript: function () {
			dispatcher.dispatch({
				type: Actions.DELETE_SCRIPT
			});
		},

		// Detail
		detailBasicUpdate: function (data) {
			dispatcher.dispatch({
				type: Actions.DETAIL_BASICINFO_UPDATE,
				data: data
			});
		},
		detailConfigScriptUpdate: function (data) {
			dispatcher.dispatch({
				type: Actions.DETAIL_CONFIG_UPDATE,
				data: data
			});
		},
		detailParameterUpdate: function (data) {
			dispatcher.dispatch({
				type: Actions.DETAIL_PARAMETER_UPDATE,
				data: data
			});
		},
		detailUpdateAction: function (data) {
			dispatcher.dispatch({
				type: Actions.DETAIL_ACTION_UPDATE,
				data: data
			});
		},
		detailCreateAction: function (data) {
			dispatcher.dispatch({
				type: Actions.DETAIL_ACTION_CREATE,
				data: data
			});
		},
		detailDeleteAction: function (data) {
			dispatcher.dispatch({
				type: Actions.DETAIL_ACTION_DELETE,
				data: data
			});
		},
		detailCreateParameter: function () {
			dispatcher.dispatch({
				type: Actions.DETAIL_PARAMETER_CREATE
			});
		},
		detailParameterDelete: function (data) {
			dispatcher.dispatch({
				type: Actions.DETAIL_PARAMETER_DELETE,
				data: data
			});
		},

		// Login
		login: function () {
			dispatcher.dispatch({
				type: Actions.AUTH_SIGNIN
			});
		},
		authDataChanged: function (data) {
			dispatcher.dispatch({
				type: Actions.AUTH_CHANGE,
				data: data
			});
		},

		// Parameter
		loadParameters: function () {
			dispatcher.dispatch({
				type: Actions.LOAD_PARAMETERS
			});
		},
		createParameter: function (data) {
			dispatcher.dispatch({
				type: Actions.CREATE_PARAMETER,
				data: data
			});
		},
		deleteParameter: function (data) {
			dispatcher.dispatch({
				type: Actions.DELETE_PARAMETER,
				data: data
			})
		},
		updateParameter: function (data) {
			dispatcher.dispatch({
				type: Actions.UPDATE_PARAMETER,
				data: data
			})
		},

		// Packages
		loadPackages: function () {
			dispatcher.dispatch({
				type: Actions.LOAD_PACKAGES
			});
		},
		uploadPackage: function (data) {
			dispatcher.dispatch({
				type: Actions.UPLOAD_PACKAGE,
				data: data
			});
		},
		deletePackage: function (data) {
			dispatcher.dispatch({
				type: Actions.DELETE_PACKAGE,
				data: data
			});
		},

		// Report
		loadReports: function (data) {
			dispatcher.dispatch({
				type: Actions.LOAD_REPORTS,
				data: data
			});
		},
		searchReport: function (data) {
			dispatcher.dispatch({
				type: Actions.SEARCH_REPORT,
				data: data
			});
		}
	}
};






