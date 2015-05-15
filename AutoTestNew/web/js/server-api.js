var prefix = '/autotest';

module.exports = {

	// Login
	login: function (username, password, callback) {
		$.ajax({
			url: prefix + '/api/login',
			method: 'POST',
			data: {
				username: username,
				password: password
			},
			success: callback
		});
	},

	// Folder related API
	loadFolders: function (callback) {
		$.ajax({
			url: prefix + '/api/folder',
			method: 'GET',
			success: callback
		});
	},
	createFolder: function (title, callback) {
		$.ajax({
			url: prefix + '/api/folder',
			method: 'POST',
			data: {
				title: title
			},
			success: callback
		});
	},
	updateFolder: function (id, title, callback) {
		$.ajax({
			url: prefix + '/api/folder/' + id,
			method: 'PUT',
			data: { title: title },
			success: callback
		});
	},
	deleteFolder: function (id, callback) {
		$.ajax({
			url: prefix + '/api/folder/' + id,
			method: 'DELETE',
			success: callback
		});
	},

	// Script related API
	loadScripts: function (folder, callback) {
		$.ajax({
			url: prefix + '/api/script/folder/' + folder,
			method: 'GET',
			success: callback
		});
	},
	loadConfigScripts: function (callback) {
		$.ajax({
			url: prefix + '/api/script/config',
			method: 'GET',
			success: callback
		});
	},
	loadScript: function (scriptId, callback) {
		$.ajax({
			url: prefix + '/api/script/detail/' + scriptId,
			method: 'GET',
			success: callback
		});
	},
	updateScript: function (script, callback) {
		$.ajax({
			url: prefix + '/api/script/' + script.id,
			method: 'PUT',
			data: script,
			success: callback
		});
	},
	createScript: function (script, callback) {
		$.ajax({
			url: prefix + '/api/script',
			method: 'POST',
			data: script,
			success: callback
		});
	},
	deleteScript: function (scriptId, callback) {
		$.ajax({
			url: prefix + '/api/script/' + scriptId,
			method: 'DELETE',
			success: callback
		});
	},

	// Parameter realated API
	loadParameters: function (callback) {
		$.ajax({
			url: prefix + '/api/parameter',
			method: 'GET',
			success: callback
		});
	},
	createParameter: function (name, value, callback) {
		$.ajax({
			url: prefix + '/api/parameter',
			method: 'POST',
			data: {
				name: name,
				value: value
			},
			success: callback
		});
	},
	updateParameter: function (id, value, callback) {
		$.ajax({
			url: prefix + '/api/parameter/' + id,
			data: {
				value: value
			},
			method: 'PUT',
			success: callback
		});
	},
	deleteParameter: function (id, callback) {
		$.ajax({
			url: prefix + '/api/parameter/' + id,
			method: 'DELETE',
			success: callback
		});
	},
	searchParameter: function (searchText, callback) {
		$.ajax({
			url: prefix + '/api/parameter/search',
			type: 'GET',
			data: {
				search: searchText
			},
			success: function (response) {
				if (response.success) {
					_parameters = response.data;
					this.emit(EVENT_PARAMETER_LIST_CHANGES);
				}
			}.bind(this),
			json: true
		});
	},

	// Package
	loadPackages: function (callback) {
		$.ajax({
			url: prefix + '/api/package',
			method: 'GET',
			success: callback
		});
	},
	uploadPackage: function (file, description, callback) {
		var formData = new FormData();
		formData.append('file', file);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', prefix + '/api/package?type=Android&description=' + encodeURIComponent(description), true);
		xhr.onload = callback;
		xhr.send(formData);
	},
	deletePackage: function (id, callback) {
		$.ajax({
			url: prefix + '/api/package/' + id,
			method: 'DELETE',
			success: callback
		});
	},

	// Report realted API
	loadReports: function (page, callback) {
		$.ajax({
			url: prefix + '/api/report',
			type: 'GET',
			data: {
				page: page
			},
			success: callback
		});
	},
	searchReport: function (searchText, callback) {
		$.ajax({
			url: prefix + '/api/report/search',
			type: 'GET',
			data: {
				search: searchText
			},
			success: callback
		});
	}
};





