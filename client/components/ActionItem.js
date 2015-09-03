import { horizontal } from './styleSheet';
import UpdateActionMutation from '../mutations/UpdateActionMutation';
var { PropTypes } = React;

class ActionItem extends React.Component {
	state = {
		editParam: this.props.action.param
	}
	_onTypeSelected = (e) => {
		Relay.Store.update(new UpdateActionMutation({
			script: this.props.script,
			actionType: 'update',
			position: this.props.action.position,
			type: e.target.text
		}));
	}
	_onTargetSelected = (e) => {
		Relay.Store.update(new UpdateActionMutation({
			script: this.props.script,
			actionType: 'update',
			position: this.props.action.position,
			target: e.target.text
		}));
	}
	_onParamChanged = (e) => {
		this.setState({
			editParam: e.target.value
		});
	}
	_onParamKeyDown = (e) => {
		if (e.keyCode == 13) {
			Relay.Store.update(new UpdateActionMutation({
				script: this.props.script,
				actionType: 'update',
				position: this.props.action.position,
				param: e.target.value
			}));
		}
	}
	_onInsertClicked = (e) => {
		Relay.Store.update(new UpdateActionMutation({
			script: this.props.script,
			actionType: 'create',
			position: this.props.action.position,
			type: this.props.config.defaultAction
		}));
	}
	_onDeleteClicked = (e) => {
		Relay.Store.update(new UpdateActionMutation({
			script: this.props.script,
			actionType: 'delete',
			position: this.props.action.position
		}));
	}
	renderActionType() {
		var actionTypeViews = this.props.config.actionTypes.map((actionType, index) =>
			<li key={index}><a onClick={this._onTypeSelected}>{actionType.type}</a></li>
		);

		return (
			<div className="btn-group" role="group">
				<button id='actionType' type="button" className="btn btn-default btn-sm dropdown-toggle"
					data-toggle="dropdown" aria-expanded='false'>
					{this.props.action.type}
					<span className="caret"></span>
				</button>
				<ul className="dropdown-menu" role="menu" aria-labelledby="actionType">
					{actionTypeViews}
				</ul>
			</div>
		);
	}
	renderActionTarget(actionConfig) {
		var targetItems = [];
		actionConfig.targets.forEach(target => {
			for (var index = 1; index <= this.props.config.targetRepeats; index++) {
				targetItems.push(`${target}[${index}]`);
			}
		});

		var actionTargetViews = targetItems.map((target, index) => {
			return (
				<li key={index}><a onClick={this._onTargetSelected}>{target}</a></li>
			);
		});
		
		return (
			<div className="btn-group" role="group">
				<button id='actionType' type="button" className="btn btn-default btn-sm dropdown-toggle"
					data-toggle="dropdown" aria-expanded='false'>
					{this.props.action.target}
					<span className="caret"></span>
				</button>
				<ul className="dropdown-menu" role="menu" aria-labelledby="actionType">
					{actionTargetViews}
				</ul>
			</div>
		);
	}
	renderActionParam() {
		return (
			<input className="form-control"
				type="text"
				value={this.state.editParam}
				onChange={this._onParamChanged}
				onKeyDown={this._onParamKeyDown}/>
		);
	}
	renderActionOperator() {
		return (
			<div className="btn-group" role="group">
				<button type="button" className="btn btn-default btn-sm"
					onClick={this._onInsertClicked}>Insert</button>
				<button type="button" className="btn btn-default btn-sm"
					onClick={this._onDeleteClicked}>X</button>
			</div>
		);
	}
	render() {
		var spaceBetween = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		};
		
		var actionConfig = this.props.config.actionTypes.filter(item => item.type == this.props.action.type)[0];

		return (
			<div>
				<div style={spaceBetween}>
					<div className="btn-group" role="group" aria-label="...">
						{this.renderActionType(actionConfig)}
						{actionConfig.targets && this.renderActionTarget(actionConfig)}
					</div>
					{this.renderActionOperator()}
				</div>
				{actionConfig.param && this.renderActionParam()}
			</div>
		);
	}
}

export default Relay.createContainer(ActionItem, {
	fragments: {
		config: () => Relay.QL`
			fragment on AppConfig {
				targetRepeats,
				defaultAction,
				actionTypes {
					type,
					targets,
					param
				}
			}
		`,
		action: () => Relay.QL`
			fragment on Action {
				position,
				type,
				target,
				param
			}
		`,
		script: () => Relay.QL`
			fragment on Script {
				id,
				${UpdateActionMutation.getFragment('script')}
			}
		`
	}
});






