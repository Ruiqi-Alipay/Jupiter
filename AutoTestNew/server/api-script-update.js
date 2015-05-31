var path = require('path'),
	moment = require('moment'),
	ApiUtils = require('./api-utils'),
    Script = require(path.join(__dirname, '..', 'mongodb', 'new-script'));

module.exports = function (req, res, next) {
	var data = req.body;
	data.date = moment();

	if (data.actions) {
		data.actions = JSON.parse(data.actions);
	}
	if (data.parameters) {
		data.parameters = JSON.parse(data.parameters);
	}
	console.log('->>>>>>>>>>>>');
	console.log(data);
	console.log('<<<<<<<<<<<<<');

	Script.findOneAndUpdate({ _id: req.params.script_id }, data, { 'new': true }, function(err, script){
		if (err) {
			return res.json({ success: false });
		}

		res.json({
			success: true,
			data: ApiUtils.toClientScriptSingle(script)
		});
	});
};