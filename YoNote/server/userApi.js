var path = require('path');
var User = require(path.join(__dirname, '..', 'mongo', 'user.js'));
var Group = require(path.join(__dirname, '..', 'mongo', 'group.js'))
var Message = require(path.join(__dirname, '..', 'mongo', 'message.js'));
var utils = require('./utils.js');
var q = require('q');

var prepareUserGroups = function (userId) {
	var defered = q.defer();

	var clientGroups = [];
	Group.find({$or: [{'members': userId}, {'creater': userId}]}).sort('date').exec(function (err, groups) {
		if (!groups || groups.length == 0) {
			return defered.resolve(clientGroups);
		}

		groups.forEach(function (group) {
			Message.find({'groupId': group._id}).sort('-timestamp').limit(2).exec(function (err, messages) {
				var clientGroup = utils.createClientGroup(group);
				clientGroup.recents = utils.createClientMessageBatch(messages);
				clientGroups.push(clientGroup);
					
				if (clientGroups.length == groups.length) defered.resolve(clientGroups);
			});
		});
	});

	return defered.promise;
};

module.exports = {
	getUser: function (req, res, next) {
		var extid = req.query.extid;
		if (!extid) return res.json({
			success: false,
			data: '请求参数错误：没有内外Token'
		});

		User.findOne({'extId': extid}, function (err, user) {
			if (!user) {
				var user = new User({
					name: extid,
					description: '职位描述',
					extId: extid
				});
				user.save(function (err, newUser) {
					if (err) return res.json({
						success: false,
						data: '新建用户错误：' + err.toString()
					});

					var clientUser = utils.createClientUser(newUser);
					clientUser.groups = [];

					res.json({
						success: true,
						data: clientUser
					});
				});
			} else {
				prepareUserGroups(user._id.toString()).then(function (groups) {
					var clientUser = utils.createClientUser(user);
					clientUser.groups = groups;

					res.json({
						success: true,
						data: clientUser
					});
				}).catch(function (err) {
					res.json({
						success: false,
						data: '同步用户群组出错：' + err.toString()
					})
				});
			}
		});
	},
	searchUser: function (req, res, next) {
		var user = req.query.user;
		if (!user) return res.json({
			success: false,
			data: '查询内容不可为空'
		});

		User.findOne({'name':  decodeURIComponent(user)}, function (err, user) {
			res.json({
				success: true,
				data: user ? utils.createClientUser(user) : user
			});
		});
	}
};






