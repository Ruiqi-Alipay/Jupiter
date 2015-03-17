var mongoose = require('mongoose');

MessageSchema = mongoose.Schema({
	groupId: String,
	userId: String,
	date: Date,
	timestamp: Number,
	content: String,
	tags: [String]
});

module.exports = mongoose.model('Message', MessageSchema);