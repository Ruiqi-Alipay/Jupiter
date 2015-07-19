var mongoose = require('mongoose');

var ParameterSchema = new mongoose.Schema({
	username: { type: String, required: true},
	name: { type: String, unique: true, required: true },
	value: { type: String, required: true }
});

module.exports = mongoose.model('ScriptParameter', ParameterSchema);