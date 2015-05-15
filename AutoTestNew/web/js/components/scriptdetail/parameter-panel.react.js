var React = require('react'),
	ReactPropTypes = React.PropTypes,
	ParameterItem = require('./parameter-item.react'),
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		parameters: ReactPropTypes.array
	},

	_onNewParameterClicked: function (event) {
		Dispatcher.detailCreateParameter();
	},
	
	render: function () {
		var styles = {
			bottomBar: {
				'display': 'flex',
				'flexDirection': 'row',
				'justifyContent': 'flex-end',
				'marginTop': '10px'
			}
		};
		var parameterViews;

		if (this.props.parameters) {
			parameterViews = this.props.parameters.map(function (parameter, index) {
				return (<ParameterItem key={index} index={index} parameter={parameter}/>);
			});
		}

		return (
			<div className="panel panel-default">
			  <div className="panel-heading">
			  	<b>脚本参数</b>
			  </div>
			  <div className="panel-body">
			  	{parameterViews}
			  	<div style={styles.bottomBar}>
			  		<button type="button" className="btn btn-default btn-sm" onClick={this._onNewParameterClicked}>New Parameter</button>
			  	</div>
			  </div>
			</div>
		);
	}
});