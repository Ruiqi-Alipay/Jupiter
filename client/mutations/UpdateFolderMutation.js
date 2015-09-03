export default class UpdateFolderMutation extends Relay.Mutation {
	static fragments = {
		folder: () => Relay.QL`
			fragment on Folder {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{updateFolder}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on UpdateFolderPayload {
				folder {
					title
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'FIELDS_CHANGE',
			fieldIDs: {
				folder: this.props.folder.id
			}
		}];
	}
	getVariables() {
		return {
			id: this.props.folder.id,
			title: this.props.title
		};
	}
}