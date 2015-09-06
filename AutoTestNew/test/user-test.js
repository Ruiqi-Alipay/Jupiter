var request = require('request'),
	assert = require('chai').assert;

describe('User interface test', function () {
	var user = {
		username: 'ruiqili',
		password: '123456',
		newPassword: '654321'
	};

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

	it('update passoword', function (done) {
		request.put({
			url: 'http://localhost/autotest/api/user?username=' + user.username + '&sessionId=' + user.sessionId,
			body: {
				oldPassword: user.password,
				newPassword: user.newPassword
			},
			json: true
		}, function (err, response, body) {
			assert.equal(body.success, true, 'create success');
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