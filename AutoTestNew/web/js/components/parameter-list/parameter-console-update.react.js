var React = require('react'),
	Dispatcher = require('../../dispatcher').utils;

var ParameterConsole = React.createClass({

	contextTypes: {
		router: React.PropTypes.func
	},
	propTypes: {
		editParameter: React.PropTypes.object.isRequired
	},

	getInitialState: function () {
		var parameter = this.props.editParameter;
		return {
			newName: parameter.name,
			newValue: parameter.value
		};
	},
	componentWillReceiveProps: function (nextProps) {
		var parameter = nextProps.editParameter;
		this.setState({
			newName: parameter.name,
			newValue: parameter.value
		});
	},

	_onNewNameChanged: function (event) {
		this.setState({
			newName: event.target.value,
			newValue: this.state.newValue
		});
	},
	_onNewValueChanged: function (event) {
		this.setState({
			newName: this.state.newName,
			newValue: event.target.value
		});
	},
	_onSubmitClicked: function (event) {
		Dispatcher.updateParameter({
			id: this.props.editParameter.id,
			value: this.state.newValue
		});
		this.setState({
			newName: '',
			newValue: ''
		});
		this.context.router.transitionTo('dashboard', {section_id: 'parameter'});
	},
	_onCancelClicked: function (event) {
		this.setState({
			newName: '',
			newValue: ''
		});
		this.context.router.transitionTo('dashboard', {section_id: 'parameter'});
	},

	render: function () {
		var styles = {
			body: {
				'marginBottom': '20px',
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'padding': '8px 0px'
			},
			icon: {
				'fontSize': '16px'
			},
			inputPart: {
				'width': '35%'
			},
			buttonPart: {
				'width': '30%',
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'justifyContent': 'center'
			},
			cancelBtn: {
				'marginRight': '10px'
			}
		};
		var newName = this.state.newName,
			newValue = this.state.newValue,
			disableBtn = !newValue || !newName || newName.length == 0 || newValue.length == 0;

		return (
			<div className="panel panel-default" style={styles.body}>
				<div style={styles.inputPart}>
					<div className="input-group">
						<span className="input-group-addon" id="new-name">Name</span>
						<input type="text" className="form-control" placeholder="parameter key" aria-describedby="new-name" value={newName} onChange={this._onNewNameChanged} disabled/>
					</div>
				</div>
				<div style={styles.inputPart}>
					<div className="input-group">
					    <span className="input-group-addon" id="new-value">Value</span>
					    <input type="text" className="form-control" placeholder="parameter value" aria-describedby="new-value" value={newValue} onChange={this._onNewValueChanged}/>
					</div>
				</div>
				<div style={styles.buttonPart}>
					<button type="button" className="btn btn-default" style={styles.cancelBtn} onClick={this._onCancelClicked}>Cancel</button>
					<button type="button" className="btn btn-primary" onClick={this._onSubmitClicked} disabled={disableBtn}>Edit Prameter</button>
				</div>
			</div>
		);
	}
});

module.exports = ParameterConsole;