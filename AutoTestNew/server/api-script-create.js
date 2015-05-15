var path = require('path'),
	moment = require('moment'),
	ApiUtils = require('./api-utils'),
    Script = require(path.join(__dirname, '..', 'mongodb', 'script'));

module.exports = function (req, res, next) {
    var script = new Script(req.body);
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