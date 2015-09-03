export default class CreateFolderMutation extends Relay.Mutation {
	static fragments = {
		user: () => Relay.QL`
			fragment on User {
				id,
				folders {
					totalCount
				}
			}
		`
	}
	getMutation() {
		return Relay.QL`mutation{createFolder}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on CreateFolderPayload {
				folderEdge,
				user {
					folders {
						totalCount
					}
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'user',
			parentID: this.props.user.id,
			connectionName: 'folders',
			edgeName: 'folderEdge',
			rangeBehaviors: {
				'': 'append'
			}
		}];
	}
	getVariables() {
		return {
			userId: this.props.user.id,
			title: this.props.title
		};
	}
}