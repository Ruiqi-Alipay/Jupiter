var path = require('path'),
	ApiUtils = require('./api-utils'),
    Script = require(path.join(__dirname, '..', 'mongodb', 'script'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		Script.findOneAndRemove({ _id: req.params.script_id, username: user.username }, function(err, script){
			if (err || !script) {
				return res.json({ success: false });
			}

			res.json({
				success: true,
				data: ApiUtils.toClientScriptSingle(script)
			});
		});
	});
};