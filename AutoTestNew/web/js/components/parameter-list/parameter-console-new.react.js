var React = require('react'),
	Dispatcher = require('../../dispatcher').utils,
	Store = require('../../store');

var ParameterConsole = React.createClass({

	contextTypes: {
		router: React.PropTypes.func
	},
	getInitialState: function () {
		return {
			newName: '',
			newValue: '',
			searchText: ''
		};
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
	_onSearchChanged: function (event) {
		Store.setParameterSearchText(event.target.value);
		this.setState({
			newName: this.state.newName,
			newValue: this.state.newValue,
			searchText: event.target.value
		});
	},
	_onNewParameterClicked: function (event) {
		Dispatcher.createParameter({
			name: this.state.newName,
			value: this.state.newValue
		});
		this.setState({
			newName: '',
			newValue: ''
		});
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
			searchInput: {
				'width': '30%'
			},
			inputPart: {
				'width': '25%'
			},
			buttonPart: {
				'width': '20%',
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'justifyContent': 'center'
			}
		};
		var newName = this.state.newName,
			newValue = this.state.newValue,
			disableBtn = !newValue || !newName || newName.length == 0 || newValue.length == 0;

		return (
			<div className="panel panel-default" style={styles.body}>
				<div style={styles.searchInput}>
					<div className="input-group">
						<span id="search" className="input-group-addon glyphicon glyphicon-search" aria-hidden="true" style={styles.icon}></span>
					  	<input type="text" className="form-control" placeholder="search parameter name and value"
					  		ria-describedby="search" value={this.props.search} onChange={this._onSearchChanged}/>
					</div>
				</div>
				<div style={styles.inputPart}>
					<div className="input-group">
						<span className="input-group-addon" id="new-name">Name</span>
						<input type="text" className="form-control" placeholder="parameter key" aria-describedby="new-name" value={newName} onChange={this._onNewNameChanged}/>
					</div>
				</div>
				<div style={styles.inputPart}>
					<div className="input-group">
					    <span className="input-group-addon" id="new-value">Value</span>
					    <input type="text" className="form-control" placeholder="parameter value" aria-describedby="new-value" value={newValue} onChange={this._onNewValueChanged}/>
					</div>
				</div>
				<div style={styles.buttonPart}>
					<button type="button" className="btn btn-primary" onClick={this._onNewParameterClicked} disabled={disableBtn}>New Prameter</button>
				</div>
			</div>
		);
	}
});

module.exports = ParameterConsole;