var path = require('path');
var User = require(path.join(__dirname, '..', 'mongo', 'user.js'));
var Group = require(path.join(__dirname, '..', 'mongo', 'group.js'))
var Message = require(path.join(__dirname, '..', 'mongo', 'message.js'));
var utils = require('./utils.js');
var q = require('q');

var prepareUserGroups = function (userId) {
	var defered = q.defer();

	Group.find({$or: [{'members': userId}, {'creater': userId}]}).sort('date').exec(function (err, groups) {
		if (!groups || groups.length == 0) {
			return defered.resolve(groups);
		}

		var task = groups.length;
		groups.forEach(function (group) {
			Message.find({'groupId': group._id}).sort('-timestamp').limit(2).exec(function (err, messages) {
				group.recents = utils.cutMessages(messages);

				task--;
				if (task == 0) defered.resolve(groups);
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
					name: '李瑞骐',
					description: '职位描述',
					extId: extid
				});
				user.save(function (err, newUser) {
					if (err) return res.json({
						success: false,
						data: '新建用户错误：' + err.toString()
					});

					res.json({
						success: true,
						data : newUser
					});
				});
			} else {
				prepareUserGroups(user._id.toString()).then(function (groups) {
					res.json({
						success: true,
						data: {
							user: user,
							groups: groups
						}
					});
				}).catch(function (err) {
					res.json({
						success: false,
						data: '同步用户群组出错：' + err.toString()
					})
				});
			}
		});
	}
};






