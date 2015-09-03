export default class CreateUserMutation extends Relay.Mutation {
	static fragments = {
		user: () => Relay.QL`
			fragment on User {
				id
			}
		`
	}
	getMutation() {
		return Relay.QL`mutation{createUser}`;
	}
	getVariables() {
		return {
			username: this.props.username,
			password: this.props.password
		};
	}
	getFatQuery() {
		return Relay.QL`
			fragment on CreateUserPayload {
				user,
				errMsg
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'FIELDS_CHANGE',
			fieldIDs: {
				user: this.props.user.id
			}
		}];
	}
}