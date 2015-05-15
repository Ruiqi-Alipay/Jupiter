var path = require('path'),
	ApiUtils = require('./api-utils'),
    Script = require(path.join(__dirname, '..', 'mongodb', 'script')),
    Folder = require(path.join(__dirname, '..', 'mongodb', 'folder'));

module.exports = function (req, res, next) {

	Folder.find(function (err, folders) {
		if (err) {
			return res.json({ success: false });
		}

		Script.findById({ _id: req.params.script_id }, function(err, script){
			if (err || !script) {
				return res.json({ success: false });
			}

			Script.find({ folder: script.folder }, {folder: 1, title: 1, type: 1, date: 1})
					.sort('-date').exec(function (err, folderScripts) {
				if (err) {
					return res.json({ success: false });
				}

				Script.find({ type: 'Config' }, {title: 1, type: 1, date: 1})
						.sort('-date').exec(function (err, configScripts) {
					if (err) {
						return res.json({ success: false });
					}

					res.json({
						success: true,
						data: {
							script: ApiUtils.toClientScriptSingle(script),
							folderScripts: ApiUtils.toClientScript(folderScripts),
							configScripts: ApiUtils.toClientScript(configScripts),
							folders: ApiUtils.toClientFolder(folders)
						}
					});
				});
			});
		});
	});
};