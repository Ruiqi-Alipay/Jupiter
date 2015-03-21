var mongoose = require('mongoose');

MessageSchema = mongoose.Schema({
	groupId: String,
	userId: String,
	date: String,
	timestamp: Number,
	html: String,
	text: String,
	tags: [String]
});

module.exports = mongoose.model('Message', MessageSchema);