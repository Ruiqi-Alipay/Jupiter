var mongoose = require('mongoose');

var parameterSchema = new mongoose.Schema({
	name: { type: String, required: true },
	value: { type: String, required: true }
});

var actionSchema = new mongoose.Schema({
	type: { type: String, required: true },
	target: { type: String },
	param: { type: String }
});

var ScriptSchema = new mongoose.Schema({
	title: { type: String, required: true },
	folder: { type: String, required: true },
	type: { type: String, required: true },
	date: { type: Date, required: true },
	config: { type: String },
	buyerId: { type: String },
	orderId: { type: String },
	orderAmount: { type: String },
	orderCouponAmount: { type: String },
	orderCombineTimes: { type: Number },
	parameters: [parameterSchema],
	actions: [actionSchema]
});

module.exports = mongoose.model('AutoScript', ScriptSchema);