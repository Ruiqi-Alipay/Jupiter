var path = require('path'),
	moment = require('moment'),
	ApiUtils = require('./api-utils'),
    Script = require(path.join(__dirname, '..', 'mongodb', 'script'));

module.exports = function (req, res, next) {
	req.body.date = moment();

	Script.findOneAndUpdate({ _id: req.params.script_id }, req.body, { 'new': true }, function(err, script){
		if (err) {
			return res.json({ success: false });
		}

		res.json({
			success: true,
			data: ApiUtils.toClientScriptSingle(script)
		});
	});
};