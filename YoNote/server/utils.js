
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
		return {
			name: user.name,
			description: user.description,
			header: user.header
		}
	},
	createClientGroup: function (group) {
		return {
			name: group.name,
			counts: group.counts,
			header: group.header,
			msgTags: group.msgTags,
			date: group.date
		}
	},
	createClientMessage: function (message) {
		return {
			date: message.date,
			timestamp: message.timestamp,
			content: message.content,
			tags: message.tags
		}
	},
};