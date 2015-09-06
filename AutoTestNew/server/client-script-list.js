var Scirpt = require('../mongodb/script'),
	Folder = require('../mongodb/folder');

module.exports = function (req ,res, next) {
	Scirpt.find({ username: req.query.username, type: req.query.type }, { title: 1, folder: 1 }, function (err, scripts) {
		var folderSet = {};
		scripts.forEach(function (script) {
			if (script.folder && script.folder != 'UNFORDERED') {
				folderSet[script.folder] = '';
			}
		});

		if (req.query.type == 'Script') {
			Folder.find({ _id: {'$in' : Object.keys(folderSet)}}, function (err, folders) {
				folders.forEach(function (folder) {
					folderSet[folder._id] = folder;
				});

				var scriptMenu = {};
				var folderIndex = 0;
				scripts.forEach(function (script) {
					if (script.folder && script.folder != 'UNFORDERED') {
						var folder = folderSet[script.folder];
						var folderMenu = scriptMenu[folder.title];
						if (!folderMenu) {
							folderIndex++;
							folderMenu = {
								index: folderIndex,
								id: folder._id,
								scripts: []
							};
							scriptMenu[folder.title] = folderMenu;
						}

						var prefix = (req.query.type == 'Script' ? (folderMenu.index + '.') : '');

						folderMenu.scripts.push({
							id: script._id,
							index: prefix + (folderMenu.scripts.length + 1),
							title: script.title
						});
					}
				});

				res.json({
					success: true,
					data: scriptMenu
				});
			});
		} else {
			var configs = [];
			scripts.forEach(function (script) {
				configs.push({
					id: script._id,
					index: configs.length + 1,
					title: script.title
				});
			});

			res.json({
				success: true,
				data: configs
			});
		}
	});
}