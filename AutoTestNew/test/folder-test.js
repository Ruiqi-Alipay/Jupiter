var request = require('request'),
	assert = require('chai').assert;

describe('Folder interface test', function () {
	var user = {
		username: 'ruiqi',
		password: '123456',
		newPassword: '654321'
	};
	var folder;

	it('create user', function (done) {
		request.post({
			url: 'http://localhost/autotest/api/user',
			body: {
				username: user.username,
				password: user.password
			},
			json: true
		}, function (err, response, body) {
			assert.isTrue(body.success, 'create success');
			done();
		});
	});

	it('sign in', function (done) {
		request.post({
			url: 'http://localhost/autotest/api/user/signin',
			body: {
				username: user.username,
				password: user.password
			},
			json: true
		}, function (err, response, body) {
			assert.isTrue(body.success, 'create success');
			assert.isString(body.data, 'session returned');
			user.sessionId = body.data;
			done();
		});
	});

	it('create folder', function (done) {
		request.post({
			url: 'http://localhost/autotest/api/folder?username=' + user.username + '&sessionId=' + user.sessionId,
			body: {
				title: 'test name'
			},
			json: true
		}, function (err, response, body) {
			assert.isTrue(body.success, 'create success');
			assert.property(body.data, 'title', 'folder title check');
			assert.equal(body.data.title, 'test name', 'folder title check');
			assert.property(body.data, 'id', 'folder id check');
			folder = body.data;
			done();
		});
	});

	it('update folder', function (done) {
		request.put({
			url: 'http://localhost/autotest/api/folder/' + folder.id + '?username=' + user.username + '&sessionId=' + user.sessionId,
			body: {
				title: 'new test name'
			},
			json: true
		}, function (err, response, body) {
			assert.isTrue(body.success, 'create success');
			assert.property(body.data, 'title', 'folder title check');
			assert.equal(body.data.title, 'new test name', 'folder title check');
			assert.property(body.data, 'id', 'folder id check');
			folder = body.data;
			done();
		});
	});

	it('list folder', function (done) {
		request.get({
			url: 'http://localhost/autotest/api/folder?username=' + user.username + '&sessionId=' + user.sessionId,
			json: true
		}, function (err, response, body) {
			assert.isTrue(body.success, 'create success');
			assert.isArray(body.data, 'folder array returned');
			assert.lengthOf(body.data, 1, 'folder length check');
			done();
		});
	});

	it('delete folder', function (done) {
		request.del({
			url: 'http://localhost/autotest/api/folder/' + folder.id + '?username=' + user.username + '&sessionId=' + user.sessionId,
			json: true
		}, function (err, response, body) {
			assert.isTrue(body.success, 'create success');
			done();
		});
	});

	it('list folder', function (done) {
		request.get({
			url: 'http://localhost/autotest/api/folder?username=' + user.username + '&sessionId=' + user.sessionId,
			json: true
		}, function (err, response, body) {
			assert.isTrue(body.success, 'create success');
			assert.isArray(body.data, 'folder array returned');
			assert.lengthOf(body.data, 0, 'folder length check');
			done();
		});
	});

	it('delete user', function (done) {
		request.del({
			url: 'http://localhost/autotest/api/user?username=' + user.username + '&sessionId=' + user.sessionId,
			json: true
		}, function (err, response, body) {
			assert.equal(body.success, true, 'create success');
			done();
		});
	});

});