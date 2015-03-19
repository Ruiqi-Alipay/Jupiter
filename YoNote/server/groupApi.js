var path = require('path');
var moment = require('moment');
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

	console.log(req.body);

	if (req.group.creater != req.body.userid && req.group.creater != req.query.userid) {
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
		if (!req.body.name || req.body.name.length == 0) return res.json({
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
				date: moment(),
				members: [],
				msgTags: [],
				counts: 0
			});

			newGroup.save(function (err, group) {
				if (err) return res.json({
					success: false,
					data: '操作失败：' + err.toString()
				});

				res.json({
					success: true,
					data: group
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

			Message.remove({groupId: removedItem._id});

			res.json({
				success: true,
				data: removedItem
			});
		})
	},
	updateGroup: function (req, res, next) {
		if (!groupOperateParamCheck(req, res)) return;

		if (req.body.name && req.body.name.length > 0) {
			req.group.name = req.body.name;
		}

		req.group.save(function (err, group) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			res.json({
				success: true,
				data: group
			});
		});
	},
	addMember: function (req, res, next) {
		if (!groupOperateParamCheck(req, res)) return;

		if (!req.body.memberId) return next(new Error('New member ID is empty!'));
		if (req.group.creater == req.body.memberId) return res.json({
			success: true
		});

		User.findById(req.body.memberId, function (err, user) {
			if (err || !user) return res.json({
				success: false,
				data: '没有找到改用户'
			});

			if (!req.group.members) {
				req.group.members = [];
			}

			if (req.group.members.indexOf(user._id.toString()) < 0) {
				req.group.members.push(user._id.toString());
			}

			req.group.save(function (err, updatedGroup) {
				if (err) return res.json({
					success: false,
					data: '操作失败：' + err.toString()
				});

				User.find({'_id': {$in: updatedGroup.members}}, function (err, users) {
					res.json({
						success: true,
						data: updatedGroup,
						ext: users
					});
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
				data: updatedGroup
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

		var date = moment();
		var newMessage = new Message({
			groupId: req.group._id,
			userId: req.body.userid,
			date: date.format('YYYY 年 M 月 D 日，H:mm:ss'),
			timestamp: date.format('x'),
			content: req.body.content,
			tags: req.body.tags
		});

		newMessage.save(function (err, message) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			Message.count({'groupId': req.group._id}, function (err, counts) {
				var groupModified = false;
				if (req.group.counts != counts) {
					req.group.counts = counts;
					groupModified = true;
				}

				if (message.tags) {
					message.tags.forEach(function (tag) {
						if (!req.group.msgTags || req.group.msgTags.indexOf(tag) < 0) {
							if (!req.group.msgTags) {
								req.group.msgTags = [];
							}

							req.group.msgTags.push(tag);
							groupModified = true;
						}
					});
				}

				if (groupModified) {
					req.group.save();
				}

				if (req.query.last) {
					Message.find({'timestamp': {$gt: req.query.last}}).sort('-timestamp').exec(function (err, messages) {
						if (err) return res.json({
							success: false,
							data: '操作失败：' + err.toString()
						});

						res.json({
							success: true,
							data: utils.cutMessages(messages),
							ext: groupModified ? req.group : undefined
						});
					});
				} else {
					res.json({
						success: true,
						data: utils.cutMessages([message]),
						ext: groupModified ? req.group : undefined
					});
				}
			});
		});
	},
	getMessages: function (req, res, next) {
		if (!messageOperateCheck(req, res)) return;

		var find = {
			groupId: req.group._id
		};
		if (req.query.tags) {
			var tags = decodeURIComponent(req.query.tags).split(',');
			if (tags && tags.length > 0) {
				console.log(tags);
				find.tags = {
					$elemMatch: { $in: tags }
				};
			}
		}
		if (req.query.last) {
			find.timestamp = {
				$lt: req.query.last
			}
		}

		Message.find(find).sort('-timestamp').limit(10).exec(function (err, messages) {
			if (err) return res.json({
				success: false,
				data: '操作失败：' + err.toString()
			});

			res.json({
				success: true,
				data: utils.cutMessages(messages)
			});
		});
	},
	geMessage: function (req, res, next) {
		if (!messageOperateCheck(req, res)) return;

		res.json({
			success: true,
			data: req.message
		});
	},
	searchContent: function (req, res, next) {
		if (!messageOperateCheck(req, res)) return;
		if (!req.query.q) return res.json({
			success: false,
			data: '查询内容不可为空'
		});

		var seatchText = decodeURIComponent(req.query.q);
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
	}
};









