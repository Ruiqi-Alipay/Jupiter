var createClientUser = function (user) {
	return {
		id: user._id.toString(),
		name: user.name,
		description: user.description,
		header: user.header
	}
};
var createClientMessage = function (message) {
	return {
		id: message._id.toString(),
		date: message.date,
		timestamp: message.timestamp,
		content: message.content,
		tags: message.tags
	}
};
var createClientGroup = function (group) {
	return {
		id: group._id.toString(),
		name: group.name,
		creater: group.creater,
		counts: group.counts,
		msgTags: group.msgTags,
		date: group.date
	}
};

module.exports = {
	cutMessages: function (messages) {
		if (messages) {
			messages.forEach(function (message) {
				if (message.content.length > 160) {
					message.content =  message.content.slice(0, 160);
				}
			});
		}
		return messages;
	},
	createClientUser: function (user) {
		return createClientUser(user);
	},
	createClientUserBatch: function (users) {
		var result = [];
		if (users) {
			users.forEach(function (item) {
				result.push(createClientUser(item));
			});
		}
		return result;
	},
	createClientGroup: function (group) {
		return createClientGroup(group);
	},
	createClientGroupBatch: function (groups) {
		var result = [];
		if (groups) {
			groups.forEach(function (item) {
				result.push(createClientGroup(item));
			});
		}
		return result;
	},
	createClientMessage: function (message) {
		return createClientMessage(message);
	},
	createClientMessageBatch: function (messages) {
		var result = [];
		if (messages) {
			messages.forEach(function (item) {
				result.push(createClientMessage(item));
			});
		}
		return result;
	},
};