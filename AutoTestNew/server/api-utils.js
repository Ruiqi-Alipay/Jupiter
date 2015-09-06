User = require('../mongodb/user');

function convertDate (date) {
	if (!date) {
		return '';
	}
	var date = new Date(date);
	return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '- ' + date.getHours() + ':' + date.getMinutes();
}

function clientParameter (parameter) {
	return {
		id: parameter._id,
		name: parameter.name,
		value: parameter.value
	};
}

function clientPackage (packageApk) {
	return {
		id: packageApk._id,
		name: packageApk.name,
		description: packageApk.description,
		type: packageApk.type,
		date: convertDate(packageApk.date)
	};
}

function clientFolder (folder) {
	return {
		id: folder._id,
		title: folder.title
	};
}

function clientScript (script) {
	return {
		id: script._id,
		title: script.title,
		type: script.type,
		folder: script.folder,
		date: convertDate(script.date),
		orderId: script.orderId,
		config: script.config,
		buyerId: script.buyerId,
		orderAmount: script.orderAmount,
		orderCouponAmount: script.orderCouponAmount,
		orderCombineTimes: script.orderCombineTimes,
		parameters: script.parameters,
		actions: script.actions
	};
}

function clientReport (report, full) {
	return {
		id: report._id,
		title: report.title,
		date: convertDate(report.date),
		content: full ? JSON.parse(report.content) : undefined,
		username: full ? report.username : undefined
	};
}

module.exports = {

	sessionCheck: function (req, callback) {
		var error = {
			success: false,
			requireSignIn: true,
			data: 'session expired'
		};
		var query = req.query;
		if (!query || !query.username || !query.sessionId) {
			return callback(error);
		}

		User.findOne({ username: query.username, sessionId: query.sessionId }, function (err, user) {
			if (err || !user) {
				callback(error);
			} else {
				callback(undefined, user);
			}
		});
	},
	parseParameters: function (scripts) {
		// body...
	},

	toClientFolder: function (folders) {
		var result = [];
		if (folders) {
			folders.forEach(function (folder) {
				result.push(clientFolder(folder));
			})
		}
		return result;
	},
	toClientFolderSingle: function (folder) {
		return clientFolder(folder);
	},

	toClientScript: function (scripts) {
		var result = [];
		if (scripts) {
			scripts.forEach(function (script) {
				result.push(clientScript(script));
			})
		}
		return result;
	},
	toClientScriptSingle: function (script) {
		return clientScript(script);
	},

	toClientReport: function (reports) {
		var result = [];
		if (reports) {
			reports.forEach(function (report) {
				result.push(clientReport(report, false));
			})
		}
		return result;
	},
	toClientReportSingle: function (report) {
		return clientReport(report, true);
	},

	toClientPackage: function (packages) {
		var result = [];
		if (packages) {
			packages.forEach(function (packageApk) {
				result.push(clientPackage(packageApk));
			})
		}
		return result;
	},
	toClientPackageSingle: function (packageApk) {
		return clientPackage(packageApk);
	},

	toClientParameter: function (parameters) {
		var result = [];
		if (parameters) {
			parameters.forEach(function (parameter) {
				result.push(clientParameter(parameter));
			})
		}
		return result;
	},
	toClientParameterSingle: function (parameter) {
		return clientParameter(parameter);
	}
	
};






