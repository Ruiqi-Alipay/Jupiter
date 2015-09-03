import { appConfigs } from './configs';
import Q from 'q';

import {
	GraphQLObjectType,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
	GraphQLFloat,
	GraphQLInt,
	GraphQLBoolean
} from 'graphql';

import {
	connectionArgs,
	connectionDefinitions,
	connectionFromArray,
	cursorForObjectInConnection,
	fromGlobalId,
	globalIdField,
	mutationWithClientMutationId,
	nodeDefinitions,
	toGlobalId,
} from 'graphql-relay';

import {
	DBUser,
	DBFolder,
	DBScript,
	DBOrderConfig
} from './database';

var {
	nodeInterface,
	nodeField
} = nodeDefinitions(
	(globalId) => {
		var {type, id} = fromGlobalId(globalId);
		if (type === 'User') {
			return DBUser.findById(id);
		} else if (type === 'Folder') {
			return DBFolder.findById(id);
		}
	},
	(obj) => {
		if (obj instanceof DBUser) {
			return GraphQLUser;
		} else if (obj instanceof DBFolder) {
			return GraphQLFolder;
		}
	}
);

export var GraphQLParameter = new GraphQLObjectType({
	name: 'Parameter',
	description: 'Script parameters',
	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: (param) => param._id
		},
		key: {
			type: new GraphQLNonNull(GraphQLString)
		},
		value: {
			type: GraphQLString
		}
	}
});

export var GraphQLOrderConfig = new GraphQLObjectType({
	name: 'OrderConfig',
	description: 'Order create configuration',
	fields: {
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
	}
});

var GraphQLAction = new GraphQLObjectType({
	name: 'Action',
	description: 'Test script action',
	fields: {
		position: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		type: {
			type: new GraphQLNonNull(GraphQLString)
		},
		target: {
			type: GraphQLString
		},
		param: {
			type: GraphQLString
		}
	}
});

var GraphQLScriptParameter = new GraphQLObjectType({
	name: 'ScriptParameter',
	description: 'Test script local parameter',
	fields: {
		position: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		key: {
			type: GraphQLString
		},
		value: {
			type: GraphQLString
		}
	}
});

export var GraphQLScript = new GraphQLObjectType({
	name: 'Script',
	description: 'Test script',
	fields: {
		id: globalIdField('Script', (obj) => obj._id),
		title: {
			type: new GraphQLNonNull(GraphQLString)
		},
		date: {
			type: new GraphQLNonNull(GraphQLString)
		},
		actions: {
			type: new GraphQLList(GraphQLAction),
			resolve: (obj) => {
				if (obj.actions) {
					obj.actions.forEach((item, index) => {
						item.position = index;
					});
				}

				return obj.actions;
			}
		},
		params: {
			type: new GraphQLList(GraphQLScriptParameter),
			resolve: (obj) => {
				if (obj.params) {
					obj.params.forEach((item, index) => {
						item.position = index;
					});
				}

				return obj.params;
			}
		},
		orderConfig: {
			type: GraphQLOrderConfig,
			resolve: (obj) => {
				if (obj.orderConfig) {
					return obj.orderConfig[0];
				}
			}
		}
	}
});

var {
	connectionType: ScriptConnection,
	edgeType: GraphQLScriptEdge
} = connectionDefinitions({
	name: 'Script',
	nodeType: GraphQLScript,
	connectionFields: () => ({
		totalCount: {
			type: GraphQLInt,
			resolve: (conn) => conn.edges.length
		}
	})
});

export var GraphQLScriptEdge = GraphQLScriptEdge;

export var GraphQLFolder = new GraphQLObjectType({
	name: 'Folder',
	description: 'Script folder',
	fields: {
		id: globalIdField('Folder', (obj) => obj._id),
		title: {
			type: new GraphQLNonNull(GraphQLString)
		},
		scripts: {
			type: ScriptConnection,
			args: connectionArgs,
			resolve: (obj, args) => {
				return Q.Promise((resolve, reject) => {
					DBScript.find({folderId: obj._id}, (err, scripts) => {
						resolve(connectionFromArray(scripts, args));
					});
				});
			}
		}
	},
	interfaces: [nodeInterface]
});

var {
	connectionType: FolderConnection,
	edgeType: GraphQLFolderEdge
} = connectionDefinitions({
	name: 'Folder',
	nodeType: GraphQLFolder,
	connectionFields: () => ({
		totalCount: {
			type: GraphQLInt,
			resolve: (conn) => conn.edges.length
		}
	})
});

export var GraphQLFolderEdge = GraphQLFolderEdge;

export var GraphQLUser = new GraphQLObjectType({
	name: 'User',
	description: 'Test platform user',
	fields: {
		id: globalIdField('User', (obj) => obj._id),
		username: {
			type: GraphQLString
		},
		folders: {
			type: FolderConnection,
			args: connectionArgs,
			resolve: (obj, args) => {
				return Q.Promise((resolve, reject) => {
					DBFolder.find({userId: obj._id}, (err, folders) => {
						resolve(connectionFromArray(folders, args));
					});
				});
			}
		}
	},
	interfaces: [nodeInterface]
});

var GraphQLActionType = new GraphQLObjectType({
	name: 'ActionType',
	fields: {
		type: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: (obj) => obj.type
		},
		targets: {
			type: new GraphQLList(GraphQLString),
			resolve: (obj) => obj.targets
		},
		param: {
			type: GraphQLBoolean,
			resolve: (obj) => obj.param
		}
	}
});

var GraphQLAppConfig = new GraphQLObjectType({
	name: 'AppConfig',
	fields: {
		defaultAction: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: () => appConfigs.defaultAction
		},
		targetRepeats: {
			type: GraphQLInt,
			resolve: () => 10
		},
		actionTypes: {
			type: new GraphQLList(GraphQLActionType),
			resolve: () => appConfigs.actionConfigs
		}
	}
});

var GraphQLApplication = new GraphQLObjectType({
	name: 'Application',
	fields: {
		config: {
			type: GraphQLAppConfig,
			resolve: () => ({})
		},
		user: {
			type: GraphQLUser,
			args: {
				username: {
					name: 'username',
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: (obj, {username}) => {
				return Q.Promise((resolve, reject) => {
					DBUser.findOne({username: username}, (err, user) => {
						if (err) {
							reject(err);
						} else if (user) {
							resolve(user);
						} else {
							resolve({_id: 'NEW_USER', username: 'Test Name'});
						}
					});
				});
			}
		},
		selectFolder: {
			type: GraphQLFolder,
			args: {
				id: {
					name: 'id',
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: (root, {id}) => {
				return Q.Promise((resolve, reject) => {
					var {id: folderId} = fromGlobalId(id);
					DBFolder.findById(folderId, (err, folder) => {
						resolve(folder);
					});
				});
			}
		},
		selectScript: {
			type: GraphQLScript,
			args: {
				id: {
					name: 'id',
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: (root, {id}) => {
				return Q.Promise((resolve, reject) => {
					var {id: scriptId} = fromGlobalId(id);
					DBScript.findById(scriptId, (err, script) => {
						resolve(script);
					});
				});
			}
		},
		parameters: {
			type: 
		}
	}
});

export var Root = new GraphQLObjectType({
	name: 'Root',
	fields: {
		app: {
			type: GraphQLApplication,
			resolve: () => {
				return {};
			}
		},
		node: nodeField
	}
});








