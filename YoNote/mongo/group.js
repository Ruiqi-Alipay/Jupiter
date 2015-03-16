var mongoose = require('mongoose');

module.exports = mongoose.model('Group', mongoose.Schema({
	name: String,
	creater: String,
	members: [String]
}));