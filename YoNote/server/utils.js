var path = require('path');
var User = require(path.join(__dirname, '..', 'mongo', 'user.js'));
var Group = require(path.join(__dirname, '..', 'mongo', 'group.js'))
var Message = require(path.join(__dirname, '..', 'mongo', 'message.js'));

var userDBToClient = function (user) {
	return {
		id: user._id.toString(),
		name: user.name,
		description: user.description,
		header: user.header
	};
};

var groupDBToClient = function (group) {
	return {
		id: group._id.toString(),
		name: group.name
	};
};

var messageDBToClient = function (message, fragment) {
	var clientMsg = {
		id: message._id,
		date: message.date
	};

	clientMsg.timestamp = message.timestamp;
	clientMsg.tags = message.tags;
	clientMsg.userId = message.userId;

	if (fragment) {
		clientMsg.content = message.content.length > 140 ? (message.content.slice(0, 140) + '...') : message.content;
	} else {
		clientMsg.content = message.content;
	}

	return clientMsg;
};

var messagesDBToClient = function (messages, fragment) {
	var clientMessages = [];

	if (messages) {
		messages.forEach(function (message) {
			clientMessages.push(messageDBToClient(message, fragment));
		});
	}

	return clientMessages;
};

module.exports = {
	userDBToClient: function (user) {
		return userDBToClient(user);
	},
	groupDBToClient: function (group) {
		return groupDBToClient(group);
	},
	messageDBToClient: function (message, fragment) {
		return messageDBToClient(message, fragment);
	},
	messagesDBToClient: function (messages, fragment) {
		return messagesDBToClient(messages, fragment);
	}
};