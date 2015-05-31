var path = require('path'),
	ApiUtils = require('./api-utils'),
    Script = require(path.join(__dirname, '..', 'mongodb', 'new-script'));

module.exports = function (req, res, next) {
	Script.findOneAndRemove({ _id: req.params.script_id }, function(err, script){
		if (err) {
			return res.json({ success: false });
		}

		res.json({
			success: true,
			data: ApiUtils.toClientScriptSingle(script)
		});
	});
};