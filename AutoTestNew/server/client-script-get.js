var Scirpt = require('../mongodb/script'),
	Folder = require('../mongodb/folder'),
	Parameter = require('../mongodb/parameter'),
	databankUtils = require('./databank-utils'),
	creditCardUtils = require('./creditcard-utils'),
	Q = require('q');

function findParameter (parameters, target) {
	for (var index in parameters) {
		if (parameters[index].name == target) {
			return parameters[index].value;
		}
	}
}

function parseParameter (parameters, localParameters, targetObject) {
	for (var key in targetObject) {
		var value = targetObject[key];
		if (typeof value == 'string') {
			var paramkey = value;
			if (value.length > 2 && value[0] == '{' && value[value.length - 1] == '}') {
				paramkey =  value.slice(1, value.length - 1);
			}
			var paramValue = findParameter(parameters, paramkey);
			if (localParameters) {
				var localParamValue = findParameter(localParameters, paramkey);
				if (localParamValue) {
					paramValue = localParamValue;
				}
			}
			if (paramValue) {
				targetObject[key] = paramValue;
			}
		}
	}
}

function processScript (parameters, script, orderEnv) {
	console.log('PROCESSING: ' + script.title);
	var defered = Q.defer();

	try {
		parseParameter(parameters, script.parameters, script);
		if (script.actions) {
			script.actions.forEach(function (action) {
				parseParameter(parameters, script.parameters, action);

				if (action.param == 'AUTOCREATE_CREDITCARD') {
					action.param = creditCardUtils.generateCreditCard();
				}
			});
		}

		var promise;
		if (script.buyerId == 'AUTOCREATE_T') {
			promise = databankUtils.createTUser(orderEnv);
		} else if (script.buyerId == 'AUTOCREATE_Q') {
			promise = databankUtils.createQUser(orderEnv);
		}

		var max = 100,
			min	= 1;

		if (promise) {
			promise
				.then(function (userId) {
					if (!script.parameters) {
						script.parameters = [];
					}
					script.parameters.push({
						name: script.buyerId,
						value:  userId
					});
					script.actions.forEach(function (action) {
						parseParameter(parameters, script.parameters, action);
					});
					return databankUtils.creatNewIpayTradeNo(orderEnv, userId, script.orderAmount > 0 ? script.orderAmount : (Math.random() * (max - min) + min).toFixed(1),
							script.orderCouponAmount > 0 ? script.orderCouponAmount : (Math.random() * (max - min) + min).toFixed(1), script.orderCombineTimes > 0 ? script.orderCombineTimes : 1);
				})
				.then(function (orderNum) {
					if (!script.parameters) {
						script.parameters = [];
					}
					script.parameters.push({
						name: script.orderId,
						value:  orderNum
					});
					script.actions.forEach(function (action) {
						parseParameter(parameters, script.parameters, action);
					});
					defered.resolve(script);
				})
				.catch(function (err) {
					script.err = err;
					console.log('REJECT_A: ' + err);
					defered.reject(script);
				});
		} else if (script.buyerId) {
			databankUtils.creatNewIpayTradeNo(orderEnv, script.buyerId, script.orderAmount > 0 ? script.orderAmount : (Math.random() * (max - min) + min).toFixed(1),
					script.orderCouponAmount > 0 ? script.orderCouponAmount : (Math.random() * (max - min) + min).toFixed(1), script.orderCombineTimes > 0 ? script.orderCombineTimes : 1)
				.then(function (orderNum) {
					if (!script.parameters) {
						script.parameters = [];
					}
					script.parameters.push({
						name: script.orderId,
						value:  orderNum
					});
					if (script.actions) {
						script.actions.forEach(function (action) {
							parseParameter(parameters, script.parameters, action);
						});
					}
					defered.resolve(script);
				})
				.catch(function (err) {
					script.err = err;
					console.log('REJECT_B: ' + err);
					defered.reject(script)
				});
		} else {
			defered.resolve(script);
		}
	} catch (err) {
		script.err = JSON.stringify(err);
		defered.reject(script);
	}

	return defered.promise;
}

function prepareScirpts (parameters, scripts, index, successList, failedList, orderEnv, callback) {
	var script = scripts[index];

	if (!script) {
		return callback(successList, failedList);
	}

	if (!script.folder || script.folder == 'UNFORDERED') {
		return prepareScirpts(parameters, scripts, index + 1, successList, failedList, orderEnv, callback);
	}

	processScript(parameters, script, orderEnv)
		.then(function (script) {
			successList.push(script);
		})
		.catch(function (script) {
			failedList.push(script);
		})
		.fin(function () {
			prepareScirpts(parameters, scripts, index + 1, successList, failedList, orderEnv, callback);
		});
}

function toClientScirpts (scripts, folderSet) {
	var clientScirpts = [];

	if (scripts) {
		scripts.forEach(function (script) {
			var folder = folderSet[script.folder];
			var actions = [];
			if (script.actions) {
				script.actions.forEach(function (action) {
					var target = action.target;
					if (target && target.indexOf('[') > 0 && target.indexOf(']')) {
						var viewType = target.slice(0, target.indexOf('[')).trim();
						var location = target.slice(target.indexOf('[') + 1, target.indexOf(']')) - 1;
						
						switch(viewType) {
							case '编辑框':
								viewType = 'android.widget.EditText';
								break;
							case '多选框':
								viewType = 'android.widget.CheckBox';
								break;
							case '单选框':
								viewType = 'android.widget.RadioButton';
								break;
							case '按钮':
								viewType = 'android.widget.Button';
								break;
							case '图片':
								viewType = 'android.widget.ImageView';
								break;
						}

						target = {
							type: 'LOCATION',
							view: viewType,
							location: location
						};
					} else {
						if (target && target.indexOf('||') > 0) {
							target = target.split('||');
						}
						
						target = {
							type: 'NAME',
							name: target
						}
					}
					actions.push({
						type: action.type,
						target: target,
						param: action.param
					});
				});
			}
			clientScirpts.push({
				title: script.title,
				folder: folder.title,
				config: script.config,
				err: script.err,
				actions: actions
			});
		})
	}

	return clientScirpts;
}

module.exports = function (req, res, next) {
	var orAlter = [];
	if (req.query.scripts) {
		orAlter.push({_id: {'$in' : req.query.scripts.split(',')}});
	}
	if (req.query.folders) {
		orAlter.push({folder: {'$in' : req.query.folders.split(',')}});
	}

	var orderEvnType = 'sit';
	if (req.query.env) {
		orderEvnType = req.query.env;
	}

	Parameter.find({username: req.query.username}, function (err, parameters) {
		Scirpt.find({username: req.query.username, '$or': orAlter}, function (err, scripts) {
			var folderSet = {};

			scripts.forEach(function (script) {
				if (script.folder && script.folder != 'UNFORDERED') {
					folderSet[script.folder] = '';
				}
			});

			Folder.find({ _id: {'$in' : Object.keys(folderSet)}}, function (err, folders) {
				folders.forEach(function (folder) {
					folderSet[folder._id] = folder;
				});

				prepareScirpts(parameters, scripts, 0, [], [], orderEvnType, function (successList, failedList) {
					res.json({
						success: true,
						data: toClientScirpts(successList, folderSet),
						extra: toClientScirpts(failedList, folderSet)
					});
				});
			});
		});
	});
}



