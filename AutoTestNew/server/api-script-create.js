var path = require('path'),
	moment = require('moment'),
	ApiUtils = require('./api-utils'),
    Script = require(path.join(__dirname, '..', 'mongodb', 'new-script'));

module.exports = function (req, res, next) {
	var data = req.body;
	if (data.actions) {
		data.actions = JSON.parse(data.actions);
	}
	if (data.parameters) {
		data.parameters = JSON.parse(data.parameters);
	}

    var script = new Script(data);
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
};