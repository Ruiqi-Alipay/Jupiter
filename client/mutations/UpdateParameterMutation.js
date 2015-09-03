export default class UpdateParameterMutation extends Relay.Mutation {
	static fragments = {
		script: () => Relay.QL`
			fragment on Script {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{updateScriptParam}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on UpdateScriptParamPayload {
				script {
					params
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
			key: this.props.key,
			value: this.props.value
		};
	}
}