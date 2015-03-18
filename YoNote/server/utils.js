
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
	}
};