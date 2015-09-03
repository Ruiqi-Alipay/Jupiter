export default class CreateScriptMutation extends Relay.Mutation {
	static fragments = {
		folder: () => Relay.QL`
			fragment on Folder {
				id,
				scripts(first: 100) {
					totalCount,
					edges {
						node {
							id
						}
					}
				}
			}
		`
	}
	getMutation() {
		return Relay.QL`mutation{createScript}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on CreateScriptPayload {
				scriptEdge,
				folder {
					scripts {
						totalCount
					}
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'folder',
			parentID: this.props.folder.id,
			connectionName: 'scripts',
			edgeName: 'scriptEdge',
			rangeBehaviors: {
				'': 'append'
			}
		}];
	}
	getVariables() {
		return {
			folderId: this.props.folder.id,
			title: this.props.title
		};
	}
}