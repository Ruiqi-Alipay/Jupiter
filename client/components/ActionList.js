import ActionItem from './ActionItem';
import UpdateActionMutation from '../mutations/UpdateActionMutation';

class ActionList extends React.Component {
	_onAppendClicked = (e) => {
		Relay.Store.update(new UpdateActionMutation({
			script: this.props.script,
			actionType: 'create',
			type: this.props.config.defaultAction
		}));
	}
	renderActions() {
		if (this.props.script.actions) {
			return this.props.script.actions.map(action =>
				<ActionItem key={action.position}
					config={this.props.config}
					script={this.props.script}
					action={action}/>
			);
		}
	}
	render() {
		var bottomBar = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			marginTop: '10px'
		};

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<b>Script Action List</b>
				</div>
				<div className="panel-body">
					<ul className='list-group'>
						{this.renderActions()}
					</ul>
				    <div style={bottomBar}>
				    	<button type="button" className="btn btn-default btn-sm"
				    		onClick={this._onAppendClicked}>Append</button>
				    </div>
				</div>
			</div>
		);
	}
}

export default Relay.createContainer(ActionList, {
	fragments: {
		config: () => Relay.QL`
			fragment on AppConfig {
				defaultAction,
				${ActionItem.getFragment('config')}
			}
		`,
		script: () => Relay.QL`
			fragment on Script {
				actions {
					${ActionItem.getFragment('action')}
				},
				${ActionItem.getFragment('script')},
				${UpdateActionMutation.getFragment('script')}
			}
		`
	}
});