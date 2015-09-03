import {
	GraphQLBoolean,
	GraphQLID,
	GraphQLInt,
	GraphQLFloat,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from 'graphql';

import {
	mutationWithClientMutationId,
	cursorForObjectInConnection,
	fromGlobalId
} from 'graphql-relay';

import {
	GraphQLUser,
	GraphQLFolder,
	GraphQLScript,
	GraphQLFolderEdge,
	GraphQLScriptEdge,
} from './queries'

import {
	DBUser,
	DBFolder,
	DBScript,
	DBParameter,
	DBOrderConfig
} from './database';

import Q from 'q';

var UpdateScriptOrderMutation = mutationWithClientMutationId({
	name: 'UpdateScriptOrder',
	inputFields: {
		scriptId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		buyerId: {
			type: GraphQLString
		},
		amount: {
			type: GraphQLFloat
		},
		couponAmount: {
			type: GraphQLFloat
		},
		repeat: {
			type: GraphQLInt
		},
		outputKey: {
			type: GraphQLString
		}
	},
	mutateAndGetPayload: ({scriptId, buyerId, amount, couponAmount, repeat, outputKey}) => {
		return Q.Promise((resolve, reject) => {
			var {id} = fromGlobalId(scriptId);
			DBScript.findById(id, (err, script) => {
				var orderConfig;
				if (!script.orderConfig) {
					orderConfig = {};
					script.orderConfig = [orderConfig];
				} else {
					orderConfig = script.orderConfig[0];
				}

				if (buyerId) {
					orderConfig.buyerId = buyerId;
				}
				if (amount) {
					orderConfig.amount = amount;
				}
				if (couponAmount) {
					orderConfig.couponAmount = couponAmount;
				}
				if (repeat) {
					orderConfig.repeat = repeat;
				}
				if (outputKey) {
					orderConfig.outputKey = outputKey;
				}

				script.save((err, script) => {
					resolve(script);
				});
			});
		});
	},
	outputFields: {
		script: {
			type: GraphQLScript,
			resolve: (script) => script
		}
	}
});

var UpdateScriptParamMutation = mutationWithClientMutationId({
	name: 'UpdateScriptParam',
	inputFields: {
		actionType: {
			type: new GraphQLNonNull(GraphQLString)
		},
		scriptId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		position: {
			type: GraphQLInt
		},
		key: {
			type: GraphQLString,
		},
		value: {
			type: GraphQLString
		}
	},
	mutateAndGetPayload: ({actionType, scriptId, position, key, value}) => {
		return Q.Promise((resolve, reject) => {
			var {id} = fromGlobalId(scriptId);
			DBScript.findById(id, (err, script) => {
				if (actionType == 'create') {
					var param = {
						key: key,
						value: value
					};

					if (!script.params) {
						script.params = [];
					}

					if (position >= 0) {
						script.params.splice(position, 0, param);
					} else {
						script.params.push(param);
					}
				} else if (actionType == 'update') {
					var param = script.params[position];
					if (key) {
						param.key = key;
					}
					if (value) {
						param.value = value;
					}
				} else if (actionType == 'delete') {
					script.params.splice(position, 1);
				}

				script.save((err, script) => {
					resolve({script});
				});
			});
		});
	},
	outputFields: {
		script: {
			type: GraphQLScript,
			resolve: ({script}) => script
		}
	}
});

var UpdateActionMutation = mutationWithClientMutationId({
	name: 'UpdateAction',
	inputFields: {
		actionType: {
			type: new GraphQLNonNull(GraphQLString)
		},
		scriptId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		position: {
			type: GraphQLInt
		},
		type: {
			type: GraphQLString
		},
		target: {
			type: GraphQLString
		},
		param: {
			type: GraphQLString
		}
	},
	outputFields: {
		script: {
			type: GraphQLScript,
			resolve: ({script}) => script
		}
	},
	mutateAndGetPayload: ({actionType, scriptId, position, type, target, param}) => {
		return Q.Promise((resolve, reject) => {
			var {id} = fromGlobalId(scriptId);
			DBScript.findById(id, (err, script) => {
				if (actionType == 'create') {
					var action = {
						type: type,
						target: target,
						param: param
					};

					if (!script.actions) {
						script.actions = [];
					}

					if (position >= 0) {
						script.actions.splice(position, 0, action);
					} else {
						script.actions.push(action);
					}
				} else if (actionType == 'update') {
					var action = script.actions[position];
					if (type) {
						action.type = type;
					}
					if (target) {
						action.target = target;
					}
					if (param) {
						action.param = param;
					}
				} else if (actionType == 'delete') {
					script.actions.splice(position, 1);
				}

				script.save((err, script) => {
					resolve({script});
				});
			});
		});
	}
});

var CreateScriptMutation = mutationWithClientMutationId({
	name: 'CreateScript',
	inputFields: {
		folderId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		title: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		scriptEdge: {
			type: GraphQLScriptEdge,
			resolve: ({script}) => {
				return Q.Promise((resolve, reject) => {
					DBScript.find({folderId: script.folderId}, (err, scirpts) => {
						var target = scirpts.filter(item => JSON.stringify(item._id) == JSON.stringify(script._id))[0];

						resolve({
							cursor: cursorForObjectInConnection(scirpts, target),
							node: target
						});
					});
				});
			}
		},
		folder: {
			type: GraphQLFolder,
			resolve: ({script}) => {
				return Q.Promise((resolve, reject) => {
					DBFolder.findById(script.folderId, (err, folder) => {
						resolve(folder);
					});
				});
			}
		}
	},
	mutateAndGetPayload: ({folderId, title}) => {
		return Q.Promise((resolve, reject) => {
			var {id} = fromGlobalId(folderId);
			var script = new DBScript();
			script.folderId = id;
			script.title = title;
			script.date = new Date();

			script.save((err, script) => {
				resolve({script});
			});
		});
	}
});

var CreateFolderMutation = mutationWithClientMutationId({
	name: 'CreateFolder',
	inputFields: {
		userId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		title: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		folderEdge: {
			type: GraphQLFolderEdge,
			resolve: ({folder}) => {
				return Q.Promise((resolve, reject) => {
					DBFolder.find({userId: folder.userId}, (err, folders) => {
						var target = folders.filter(item => JSON.stringify(item._id) == JSON.stringify(folder._id))[0];

						resolve({
							cursor: cursorForObjectInConnection(folders, target),
							node: target
						});
					});
				});
			}
		},
		user: {
			type: GraphQLUser,
			resolve: ({folder}) => {
				return Q.Promise((resolve, reject) => {
					DBUser.findById(folder.userId, (err, user) => {
						resolve(user);
					});
				});
			}
		}
	},
	mutateAndGetPayload: ({userId, title}) => {
		return Q.Promise((resolve, reject) => {
			var {type, id} = fromGlobalId(userId); 

			var folder = new DBFolder();
			folder.userId = id;
			folder.title = title;

			folder.save((err, folder) => {
				resolve({folder});
			});
		});
	}
});

var UpdateFolderMutation = mutationWithClientMutationId({
	name: 'UpdateFolder',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		title: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		folder: {
			type: GraphQLFolder,
			resolve: ({folder}) => {
				return folder;
			}
		}
	},
	mutateAndGetPayload: ({id, title}) => {
		return Q.Promise((resolve, reject) => {
			var {type, id: folderId} = fromGlobalId(id);
			DBFolder.findOneAndUpdate({_id: folderId}, {title: title}, { 'new': true }, (err, folder) => {
				resolve({folder});
			});
		});
	}
});

var DeleteFolderMutation = mutationWithClientMutationId({
	name: 'DeleteFolder',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		deletedFolderId: {
			type: GraphQLString,
			resolve: ({id}) => id
		},
		user: {
			type: GraphQLUser,
			resolve: ({id, folder}) => {
				return Q.Promise((resolve, reject) => {
					var {id: userId} = fromGlobalId(folder.userId);
					DBUser.findById(userId, (err, user) => {
						resolve(user);
					});
				})
			}
		}
	},
	mutateAndGetPayload: ({id}) => {
		return Q.Promise((resolve, reject) => {
			var {type, id: folderId} = fromGlobalId(id);
			DBFolder.findOneAndRemove({_id: folderId}, (err, folder) => {
				resolve({id, folder});
			});
		});
	}
});

var CreateUserMutation = mutationWithClientMutationId({
	name: 'CreateUser',
	inputFields: {
		username: {
			type: new GraphQLNonNull(GraphQLString)
		},
		password: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		user: {
			type: GraphQLUser
		},
		errMsg: {
			type: GraphQLString
		}
	},
	mutateAndGetPayload: ({username, password}) => {
		return Q.Promise((resolve, reject) => {
			var user = new DBUser();
			user.username = username;
			user.password = password;

			user.save((err, user) => {
				resolve({
					user: user,
					errMsg: err
				});
			})
		});
	}
});

export var Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createUser: CreateUserMutation,
		createFolder: CreateFolderMutation,
		updateFolder: UpdateFolderMutation,
		deleteFolder: DeleteFolderMutation,
		createScript: CreateScriptMutation,
		updateAction: UpdateActionMutation,
		updateScriptParam: UpdateScriptParamMutation,
		updateScriptOrder: UpdateScriptOrderMutation
	}
});


