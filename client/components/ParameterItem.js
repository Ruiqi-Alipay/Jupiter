import UpdateParameterMutation from '../mutations/UpdateParameterMutation';

class ParameterItem extends React.Component {
	state = {
		editKey: this.props.param.key,
		editValue: this.props.param.value
	}
	_onNameChanged = (e) => {
		this.setState({
			editKey: e.target.value
		});
	}
	_onValueChanged = (e) => {
		this.setState({
			editValue: e.target.value
		});
	}
	_onNameKeyDown = (e) => {
		if (e.keyCode == 13) {
			Relay.Store.update(new UpdateParameterMutation({
				script: this.props.script,
				actionType: 'update',
				position: this.props.param.position,
				key: e.target.value
			}));
		}
	}
	_onValueKeyDown = (e) => {
		if (e.keyCode == 13) {
			Relay.Store.update(new UpdateParameterMutation({
				script: this.props.script,
				actionType: 'update',
				position: this.props.param.position
			}));
		}
	}
	_onDeleteClicked = (e) => {
		Relay.Store.update(new UpdateParameterMutation({
			script: this.props.script,
			actionType: 'delete',
			position: this.props.param.position,
			value: e.target.value
		}));
	}
	render() {
		var contentStyle = {
			'display': 'flex',
			'flexDirection': 'row',
			'alignItems': 'center'
		};

		return (
			<div style={contentStyle}>
				<div style={{width: '5%'}}>
					<span className="label label-default">{this.props.param.position + 1}</span>
				</div>
				<div style={{width: '75%', paddingRight: '8px'}}>
					<div>
						<div className="input-group">
							<span className="input-group-addon" id="parameter-name">Name</span>
							<input type="text" className="form-control" placeholder="parameter name"
								aria-describedby="parameter-name" value={this.state.editKey} onChange={this._onNameChanged} onKeyDown={this._onNameKeyDown}/>
						</div>
					</div>
					<div>
						<div className="input-group">
						    <span className="input-group-addon" id="parameter-value">Value</span>
						    <input type="text" className="form-control" placeholder="parameter value"
						    	aria-describedby="parameter-value" value={this.state.editValue} onChange={this._onValueChanged} onKeyDown={this._onValueKeyDown}/>
						</div>
					</div>
				</div>
				<div style={{width: '20%'}}>
					<button type="button" className="btn btn-default btn-sm" onClick={this._onDeleteClicked}>Delete</button>
				</div>
			</div>
		);
	}
}

export default Relay.createContainer(ParameterItem, {
	fragments: {
		param: () => Relay.QL`
			fragment on ScriptParameter {
				position,
				key,
				value
			}
		`,
		script: () => Relay.QL`
			fragment on Script {
				id,
				${UpdateParameterMutation.getFragment('script')}
			}
		`
	}
});