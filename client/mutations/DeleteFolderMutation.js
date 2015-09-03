export default class DeleteFolderMutation extends Relay.Mutation {
	static fragments = {
		folder: () => Relay.QL`
			fragment on Folder {
				id
			}
		`,
		user: () => Relay.QL`
			fragment on User {
				id,
				folders {
					totalCount
				}
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{deleteFolder}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on DeleteFolderPayload {
				deletedFolderId,
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
			type: 'NODE_DELETE',
			parentName: 'user',
			parentID: this.props.user.id,
			connectionName: 'folders',
			deletedIDFieldName: 'deletedFolderId'
		}];
	}
	getVariables() {
		return {
			id: this.props.folder.id
		};
	}
}