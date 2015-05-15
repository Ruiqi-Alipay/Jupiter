var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		index: ReactPropTypes.number.isRequired,
		active: ReactPropTypes.bool.isRequired
	},

	_onItemClicked: function (event) {
		Dispatcher.loadReports(this.props.index);
	},

	render: function () {
		var itemStyle = {
			'minWidth': '50px',
			'display': 'flex',
			'justifyContent': 'center',
			'alignItem': 'center'
		};

		return (
			<li className={this.props.active ? 'active' : ''} onClick={this._onItemClicked}>
				<a style={itemStyle}>{this.props.index + 1}</a>
			</li>
		);
	}
});