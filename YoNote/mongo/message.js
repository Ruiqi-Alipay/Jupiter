var mongoose = require('mongoose');

module.exports = mongoose.model('Message', mongoose.Schema({
	groupId: String,
	userId: String,
	date: Date,
	timestamp: Number,
	content: String,
	tags: [String]
}));