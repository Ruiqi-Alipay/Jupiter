import mongoose from 'mongoose';

export var DBUser = mongoose.model('User', new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true }
}));

export var DBFolder = mongoose.model('Folder', new mongoose.Schema({
	userId: { type: String, required: true },
	title: { type: String, required: true }
}));

// ParameterSchema.index({ key: 1, scriptId: 1 }, { unique: true });

export var DBParameter = mongoose.model('Parameter', new mongoose.Schema({
	key: { type: String, required: true },
	value: { type: String }
}));

var actionSchema = new mongoose.Schema({
	type: { type: String, required: true },
	target: { type: String },
	param: { type: String }
});

var LocalParameterSchema = new mongoose.Schema({
	key: { type: String },
	value: { type: String }
});

var OrderConfig = new mongoose.Schema({
	buyerId: { type: String },
	amount: { type: Number },
	couponAmount: { type: Number },
	repeat: { type: Number },
	outputKey: { type: String }
})

export var DBScript = mongoose.model('Script', new mongoose.Schema({
	folderId: { type: String, required: true },
	title: { type: String, required: true },
	date: { type: Date, required: true },
	actions: [actionSchema],
	params: [LocalParameterSchema],
	orderConfig: [OrderConfig]
}));






