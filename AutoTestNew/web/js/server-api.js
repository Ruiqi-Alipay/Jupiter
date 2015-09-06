var prefix = 'http://android.t8129aqcn.alipay.net/autotest',
	request = require('request');

module.exports = {

	// Login
	login: function (username, password, callback) {
		request({
			url: prefix + '/api/user/signin',
			method: 'POST',
			json: {
				username: username,
				password: password
			}
		}, callback);
	},
	register: function (username, password, callback) {
		request({
			url: prefix + '/api/user',
			method: 'POST',
			json: {
				username: username,
				password: password
			}
		}, callback);
	},

	// Folder related API
	loadFolders: function (callback) {
		request({
			url: prefix + '/api/folder',
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'GET',
			json: true
		}, callback);
	},
	createFolder: function (title, callback) {
		request({
			url: prefix + '/api/folder',
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'POST',
			json: {
				title: title
			}
		}, callback);
	},
	updateFolder: function (id, title, callback) {
		request({
			url: prefix + '/api/folder/' + id,
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'PUT',
			data: { title: title },
			json: true
		}, callback);
	},
	deleteFolder: function (id, callback) {
		request({
			url: prefix + '/api/folder/' + id,
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'DELETE',
			json: true
		}, callback);
	},

	// Script related API
	loadScripts: function (folder, callback) {
		request({
			url: prefix + '/api/script/folder/' + folder,
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'GET',
			json: true
		}, callback);
	},
	loadConfigScripts: function (callback) {
		request({
			url: prefix + '/api/script/config',
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'GET',
			json: true
		}, callback);
	},
	loadScript: function (scriptId, callback) {
		request({
			url: prefix + '/api/script/detail/' + scriptId,
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'GET',
			json: true
		}, callback);
	},
	updateScript: function (script, callback) {
		request({
			url: prefix + '/api/script/' + script.id,
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'PUT',
			json: script
		}, callback);
	},
	createScript: function (script, callback) {
		request({
			url: prefix + '/api/script',
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'POST',
			json: script
		}, callback);
	},
	deleteScript: function (scriptId, callback) {
		request({
			url: prefix + '/api/script/' + scriptId,
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'DELETE',
			json: true
		}, callback);
	},

	// Parameter realated API
	loadParameters: function (callback) {
		request({
			url: prefix + '/api/parameter',
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'GET',
			json: true
		}, callback);
	},
	createParameter: function (name, value, callback) {
		request({
			url: prefix + '/api/parameter',
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'POST',
			json: {
				name: name,
				value: value
			}
		}, callback);
	},
	updateParameter: function (id, value, callback) {
		request({
			url: prefix + '/api/parameter/' + id,
			qs: JSON.parse(localStorage.getItem('session')),
			json: {
				value: value
			},
			method: 'PUT'
		}, callback);
	},
	deleteParameter: function (id, callback) {
		request({
			url: prefix + '/api/parameter/' + id,
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'DELETE',
			json: true
		}, callback);
	},
	searchParameter: function (searchText, callback) {
		var query = JSON.parse(localStorage.getItem('session'));
		query.search = searchText;
		request({
			url: prefix + '/api/parameter/search',
			qs: query,
			type: 'GET',
			json: true
		}, callback);
	},

	// Package
	loadPackages: function (callback) {
		request({
			url: prefix + '/api/package',
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'GET',
			json: true
		}, callback);
	},
	uploadPackage: function (file, description, callback) {
		var session = JSON.parse(localStorage.getItem('session'));

		var formData = new FormData();
		formData.append('file', file);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', prefix + '/api/package?'
				+ 'type=Android'
				+ '&description=' + encodeURIComponent(description)
				+ '&username=' + session.username
				+ '&sessionId=' + session.sessionId, true);
		xhr.onload = callback;
		xhr.send(formData);
	},
	deletePackage: function (id, callback) {
		request({
			url: prefix + '/api/package/' + id,
			qs: JSON.parse(localStorage.getItem('session')),
			method: 'DELETE',
			json: true
		}, callback);
	},

	// Report realted API
	loadReports: function (page, callback) {
		var query = JSON.parse(localStorage.getItem('session'));
		query.page = page;
		request({
			url: prefix + '/api/report',
			qs: query,
			type: 'GET',
			json: true
		}, callback);
	},
	searchReport: function (searchText, callback) {
		var query = JSON.parse(localStorage.getItem('session'));
		query.search = searchText;
		request({
			url: prefix + '/api/report/search',
			qs: query,
			type: 'GET',
			json: true
		}, callback);
	},
	loadReport: function (title, callback) {
		var query = JSON.parse(localStorage.getItem('session'));
		query.title = title;
		request({
			url: prefix + '/api/report',
			qs: query,
			type: 'GET',
			json: true
		}, callback);
	}
};





