var path = require('path');
var utils = require('./utils.js');
var Group = require(path.join(__dirname, '..', 'mongo', 'group.js'));
var User = require(path.join(__dirname, '..', 'mongo', 'user.js'));
var Message = require(path.join(__dirname, '..', 'mongo', 'message.js'));

var groupOperateParamCheck = function (req, res) {
	if (!req.group) {
	 	res.json({
			success: false,
			data: '参数错误：没有找到改群组'
		});
		return false;
	}

	if (req.group.creater != req.body.userid) {
		res.json({
			success: false,
			data: '操作失败：您没有权限这样做'
		});
		return false;
	}

	return true;
}

var messageOperateCheck = function (req, res) {
	if (!req.group) {
		res.json({
			success: false,
			data: '操作失败：无效的群组'
		})
		return false;
	}

	var userid = req.query.userid ? req.query.userid : req.body.userid;

	if (!userid || (req.group.creater != userid && (!req.group.members || req.group.members.indexOf(req.body.userid) < 0))) {
		res.json({
			success: false,
			data: '操作失败：您没有权限这样做'
		});
		return false;
	}	

	return true;
}

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
			if (!err && message.groupId == req.group._id) {
				req.message = message;
			}

			return next();
		});
	},
	createGroup: function (req, res, next) {
		if (!req.body.name) return res.json({
			success: false,
			data: '操作失败：新群组名称为空！'
		});
		
		if (!req.body.userid) return next(new Error('query params userid is empty!'))

		User.findById(req.body.userid, function (err, user) {
			if (err || !user) return res.json({
				success: false,
				data: '操作失败：无效的用户'
			});

			var newGroup = new Group({
				name: req.body.name,
				creater: req.body.userid,
				members: []
			});

			newGroup.save(function (err, group) {
				if (err) return res.json({
					success: false,
					data: '操作失败：' + err.toString()
				});

				res.json({
					success: true,
					data: utils.groupDBToClient(group)
				});
			});
		});
	},
	deleteGroup: function (req, res, next) {
		if (!groupOperateParamCheck(req, res)) return;

		req.group.remove(function (err, removedItem) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			res.json({
				success: true,
				data: utils.groupDBToClient(removedItem)
			});
		})
	},
	updateGroup: function (req, res, next) {
		if (!groupOperateParamCheck(req, res)) return;

		if (req.body.name) {
			req.group.name = req.body.name;
		}

		req.group.save(function (err, group) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			res.json({
				success: true,
				data: utils.groupDBToClient(group)
			});
		});
	},
	addMember: function (req, res, next) {
		if (!groupOperateParamCheck(req, res)) return;

		if (!(req.body instanceof Array)) return next(new Error('Add members: body is not a array!'));

		User.find({'_id': {$in: req.body}}, function (err, users) {
			if (err || users.length != req.body.length) return res.json({
				success: false,
				data: '操作失败：无效的用户'
			});

			if (!req.group.members) {
				req.group.members = [];
			}

			req.body.forEach(function (groupId) {
				if (req.group.members.indexOf(groupId) < 0) {
					req.group.members.push(groupId);
				}
			});

			req.group.save(function (err, updatedGroup) {
				if (err) return res.json({
					success: false,
					data: '操作失败：' + err.toString()
				});

				res.json({
					success: true,
					data: utils.groupDBToClient(updatedGroup)
				});
			})
		});
	},
	removeMember: function (req, res, next) {
		if (!groupOperateParamCheck(req, res)) return;

		if (!(req.body instanceof Array)) return next(new Error('Please place the member id which you want to remove in post body in Array format!'));

		req.body.forEach(function (groupId) {
			var index = req.group.members.indexOf(groupId);
			if (index >= 0) {
				req.group.members.splice(index, 1);
			}
		});

		req.group.save(function (err, updatedGroup) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			res.json({
				success: true,
				data: utils.groupDBToClient(updatedGroup)
			});
		})
	},
	createMessage: function (req, res, next) {
		if (!messageOperateCheck(req, res)) return;

		if (!req.body.content) {
			return res.json({
				success: false,
				data: '操作失败：消息内容不得为空'
			});
		}

		var currentDate = new Date();
		var newMessage = new Message({
			groupId: req.group._id,
			userId: req.body.userid,
			date: currentDate,
			timestamp: currentDate.getTime(),
			content: req.body.content,
			tags: req.body.tags
		});

		newMessage.save(function (err, message) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			var lastTimestamp = req.query.last;
			if (lastTimestamp) {
				Message.find({'timestamp': {$gt: lastTimestamp}}).sort('-timestamp').exec(function (err, messages) {
					if (err) return res.json({
						success: false,
						data: '操作失败：' + err.toString()
					});

					res.json({
						success: true,
						data: utils.messagesDBToClient(messages, true)
					});
				});
			} else {
				res.json({
					success: true,
					data: [utils.messageDBToClient(message, true)]
				});
			}
		});
	},
	getMessages: function (req, res, next) {
		if (!messageOperateCheck(req, res)) return;

		var timestamp = req.query.last;
		var find = {};
		if (timestamp) {
			find.timestamp = {
				$lt: timestamp
			}
		}

		Message.find(find).sort('-timestamp').limit(10).exec(function (err, messages) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			res.json({
				success: true,
				data: utils.messagesDBToClient(messages, true)
			});
		});
	},
	geMessage: function (req, res, next) {
		if (!messageOperateCheck(req, res)) return;

		return res.json(utils.messageDBToClient(req.message));
	},
	searchContent: function (req, res, next) {
		if (!messageOperateCheck(req, res)) return;
		if (!req.query.q) return res.json({
			success: false,
			data: '查询内容不可为空'
		});

		var seatchText = decodeURIComponent(req.query.q);
		console.log('SEARCH: ' + '\"' + seatchText + '\"');
		Message.find({'content': new RegExp('.*' + seatchText + '.*')}, function (err, items) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			res.json({
				success: true,
				data: items
			});
		});
	},
	searchTags: function (req, res, next) {

	}
};









