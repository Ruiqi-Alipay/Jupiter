var path = require('path');
var User = require(path.join(__dirname, '..', 'mongo', 'user.js'));
var Group = require(path.join(__dirname, '..', 'mongo', 'group.js'))
var Message = require(path.join(__dirname, '..', 'mongo', 'message.js'));
var utils = require('./utils.js');
var q = require('q');

var prepareUserGroups = function (userId) {
	var defered = q.defer();

	Group.find({'members': userId.toString()}, function (err, groups) {
		var clientGroups = [];
		if (!groups || groups.length == 0) {
			return defered.resolve(clientGroups);
		}

		groups.forEach(function (group) {
			Message.find({'groupId': group._id}).sort('-date').limit(2).exec(function (err, messages) {
				var clientGroup = utils.groupDBToClient(group);
				clientGroup.recents = utils.messagesDBToClient(messages, true);
				clientGroups.push(clientGroup);

				if (clientGroups.length == groups.length) defered.resolve(clientGroups);
			});
		});
	});

	return defered.promise;
};

module.exports = {
	userExtId: function (req, res, next, id) {
		utils.findUserByExtId(id, function (user) {
			if (user) {
				req.user = user;
			} else {
				req.extId = id;
			}

			return next();
		});
	},
	getUser: function (req, res, next) {
		if (!req.user) {
			var user = new User({
				name: '李瑞骐',
				description: '职位描述',
				extId: req.extId
			});
			user.save(function (err, newUser) {
				if (err) return next(err);

				res.json({
					success: true,
					data : utils.userDBToClient(newUser)
				});
			});
		} else {
			prepareUserGroups(req.user._id).then(function (groups) {
				var clientUser = utils.userDBToClient(req.user);
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
	}
};






