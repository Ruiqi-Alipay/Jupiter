var path = require('path');
var utils = require('./utils.js');
var Group = require(path.join(__dirname, '..', 'mongo', 'group.js'));
var User = require(path.join(__dirname, '..', 'mongo', 'user.js'));
var Message = require(path.join(__dirname, '..', 'mongo', 'message.js'));

module.exports = {
	groupId: function (req, res, next, id) {
		Group.findById(id, function (err, group) {
			if (group) {
				req.group = group;
			}

			return next();
		});
	},
	messageId: function (req, res, next, id) {
		if (!req.group) return next(new Error('Group not found!'));

		Message.findById(id, function (err, message) {
			if (err || message.groupId != req.group._id) return next(new Error('Message not found!'));

			req.message = message;
			return next();
		});
	},
	createGroup: function (req, res, next) {
		if (!req.body.name) return next(new Error('New group must have a name!'));
		if (!req.param('userId')) return next(new Error('None userId found for creating new group!'));

		utils.findUserByExtId(req.param('userId'), function (user) {
			if (!user) return next(new Error('User not found!'));

			var newGroup = new Group({
				name: req.body.name,
				creater: user._id,
				members: []
			});

			newGroup.save(function (err, group) {
				if (err) return next('Cerate group failed: ' + err);

				return res.json(utils.groupDBToClient(group));
			});
		});
	},
	deleteGroup: function (req, res, next) {
		if (!req.group) return next(new Error('Group not found!'));

		req.group.remove(function (err, removedItem) {
			if (err) return next(err);

			return res.json(removedItem);
		})
	},
	updateGroup: function (req, res, next) {
		if (!req.group) return next(new Error('Group not found, update failed!'));

		var userId = req.param('userId');
		if (!userId) return next(new Error('None userId found for updating group!'));
		if (userId != req.group.creater) return next(new Error('Only the group creater can do group update!'));

		if (req.body.name) {
			req.group.name = req.body.name;
		}

		req.group.save(function (err, group) {
			if (err) return next('Update group failed: ' + err);

			return res.json(utils.groupDBToClient(group));
		});
	},
	addMember: function (req, res, next) {
		if (!req.group) return next(new Error('Group not found, update failed!'));

		var userId = req.param('userId');
		if (!userId) return next(new Error('None userId found for updating group!'));
		if (userId != req.group.creater) return next(new Error('Only the group creater can add member!'));
		if (!(req.body instanceof Array)) return next(new Error('Please place the new member\'s id in post body in Array format!'));

		User.find({'_id': {$in: req.body}}, function (err, users) {
			if (err || users.length != req.body.length) return next(new Error('New member can not been found!'));

			if (!req.group.members) {
				req.group.members = [];
			}

			req.body.forEach(function (groupId) {
				if (req.group.members.indexOf(groupId) < 0) {
					req.group.members.push(groupId);
				}
			});

			req.group.save(function (err, updatedGroup) {
				if (err) return next(new Error(err));

				return res.json(updatedGroup);
			})
		});
	},
	removeMember: function (req, res, next) {
		if (!req.group) return next(new Error('Group not found, update failed!'));

		var userId = req.param('userId');
		if (!userId) return next(new Error('None userId found for updating group!'));
		if (userId != req.group.creater) return next(new Error('Only the group creater can remove member!'));
		if (!(req.body instanceof Array)) return next(new Error('Please place the member id which you want to remove in post body in Array format!'));

		if (!req.group.members) return res.json(req.group);

		req.body.forEach(function (groupId) {
			var index = req.group.members.indexOf(groupId);
			if (index >= 0) {
				req.group.members.splice(index, 1);
			}
		});

		req.group.save(function (err, updatedGroup) {
			if (err) return next(new Error(err));

			return res.json(updatedGroup);
		})
	},
	createMessage: function (req, res, next) {
		if (!req.group) return next(new Error('Group not found!'));

		var userId = req.param('userId');
		if (!userId) return next(new Error('None userId found for creating message!'));
		if (req.group.creater != userId && (!req.group.members || req.group.members.indexOf(userId) < 0)) return next(new Error('User not in this group, can not create messages!'));
		if (!req.body.content) return next(new Error('New message must has contents!'));

		var currentDate = new Date();
		var newMessage = new Message({
			groupId: req.group._id,
			userId: userId,
			date: currentDate,
			timestamp: currentDate.getTime(),
			content: req.body.content
		});

		if (req.body.tags) {
			newMessage.tags = req.body.tags;
		}

		newMessage.save(function (err, message) {
			if (err) return next(new Error('Create new message failed: ' + err));

			var lastTimestamp = req.param('last');
			if (lastTimestamp) {
				Message.find({'timestamp': {$gt: lastTimestamp}}).sort('timestamp').exec(function (err, messages) {
					if (err) return next(err);

					return res.json(utils.messagesDBToClient(messages, true));
				});
			} else {
				return res.json(utils.messageDBToClient(message, true));
			}
		});
	},
	getMessages: function (req, res, next) {
		if (!req.group) return next(new Error('Group not found!'));

		var userId = req.param('userId');
		if (!userId) return next(new Error('None userId found for creating message!'));
		if (req.group.creater != userId && (!req.group.members || req.group.members.indexOf(userId) < 0)) return next(new Error('User not in this group, can not get messages!'));
		
		var timestamp = req.param('last');
		var find = {};
		if (timestamp) {
			find.timestamp = {
				$gt: timestamp
			}
		}

		Message.find(find).sort('timestamp').limit(10).exec(function (err, messages) {
			if (err) return next(err);

			return res.json(utils.messagesDBToClient(messages, true));
		});
	},
	geMessage: function (req, res, next) {
		return res.json(utils.messageDBToClient(req.message));
	}
};









