var React = require('react'),
	ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
	contextTypes: {
		router: ReactPropTypes.func
	},
	propTypes: {
		index: ReactPropTypes.number.isRequired,
		title: ReactPropTypes.string.isRequired,
		select: ReactPropTypes.bool.isRequired,
		success: ReactPropTypes.bool.isRequired,
		clickFunc: ReactPropTypes.func.isRequired
	},

	_itemClicked: function () {
		this.props.clickFunc(this.props.index);
	},

	render: function () {
		var icon = {
			'fontSize': '16px',
			'marginRight': '10px',
			'color': this.props.success ? '#00CC00' : '#CC0000'
		};

		var iconClass = this.props.success ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove',
			contentClass = this.props.select ? 'list-group-item active' : 'list-group-item';

		return (
			<a className={contentClass} onClick={this._itemClicked}>
				<div><span className={iconClass} style={icon} aria-hidden="true"></span>{this.props.title}</div>
			</a>
		);
	}
});



