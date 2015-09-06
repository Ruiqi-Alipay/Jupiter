var path = require('path'),
	moment = require('moment'),
	ApiUtils = require('./api-utils'),
    Script = require(path.join(__dirname, '..', 'mongodb', 'script'));

module.exports = function (req, res, next) {
	ApiUtils.sessionCheck(req, function (err, user) {
		if (err) {
			return res.json(err);
		}

		var data = req.body;
		if (data.actions) {
			data.actions = JSON.parse(data.actions);
		}
		if (data.parameters) {
			data.parameters = JSON.parse(data.parameters);
		}

	    var script = new Script(data);
	    script.username = user.username;
	    script.date = moment();

	    script.save(function(err, script){
			if (err) {
				return res.json({ success: false });
			}

			res.json({
				success: true,
				data: ApiUtils.toClientScriptSingle(script)
			});
	    });
	});
};