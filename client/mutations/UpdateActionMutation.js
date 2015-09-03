export default class UpdateActionMutation extends Relay.Mutation {
	static fragments = {
		script: () => Relay.QL`
			fragment on Script {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{updateAction}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on UpdateActionPayload {
				script {
					actions
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'FIELDS_CHANGE',
			fieldIDs: {
				script: this.props.script.id
			}
		}];
	}
	getVariables() {
		return {
			scriptId: this.props.script.id,
			actionType: this.props.actionType,
			position: this.props.position,
			type: this.props.type,
			target: this.props.target,
			param: this.props.param
		};
	}
}