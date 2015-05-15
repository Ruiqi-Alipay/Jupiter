var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		parameter: ReactPropTypes.object.isRequired,
		index: ReactPropTypes.number.isRequired
	},

	_onNameChanged: function (event) {
		Dispatcher.detailParameterUpdate({
			index: this.props.index,
			name: event.target.value
		});
	},
	_onValueChanged: function (event) {
		Dispatcher.detailParameterUpdate({
			index: this.props.index,
			value: event.target.value
		});
	},
	_onDeleteClicked: function (event) {
		Dispatcher.detailParameterDelete({
			index: this.props.index
		});
	},

	render: function () {
		var contentStyle = {
			'display': 'flex',
			'flexDirection': 'row',
			'alignItems': 'center'
		};

		return (
			<div style={contentStyle}>
				<div style={{width: '5%'}}>
					<span className="label label-default">{this.props.index + 1}</span>
				</div>
				<div style={{width: '75%', paddingRight: '8px'}}>
					<div>
						<div className="input-group">
							<span className="input-group-addon" id="parameter-name">Name</span>
							<input type="text" className="form-control" placeholder="parameter name"
								aria-describedby="parameter-name" value={this.props.parameter.name} onChange={this._onNameChanged}/>
						</div>
					</div>
					<div>
						<div className="input-group">
						    <span className="input-group-addon" id="parameter-value">Value</span>
						    <input type="text" className="form-control" placeholder="parameter value"
						    	aria-describedby="parameter-value" value={this.props.parameter.value} onChange={this._onValueChanged}/>
						</div>
					</div>
				</div>
				<div style={{width: '20%'}}>
					<button type="button" className="btn btn-default btn-sm" onClick={this._onDeleteClicked}>Delete</button>
				</div>
			</div>
		);
	}
});




