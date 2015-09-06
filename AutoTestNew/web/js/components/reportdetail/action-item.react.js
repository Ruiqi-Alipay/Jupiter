var React = require('react'),
	ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
	propTypes: {
		username: ReactPropTypes.string.isRequired,
		reportTitle: ReactPropTypes.string.isRequired,
		action: ReactPropTypes.object.isRequired
	},

	render: function () {
		var action = this.props.action;
		var icon = {
			'fontSize': '16px',
			'marginRight': '10px',
			'color': action.success ? '#00CC00' : '#CC0000'
		};
		var content = {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between'
		};

		var iconClass = action.success ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove';

		var errorView = '';
		if (action.err) {
			errorView = (
				<p style={{color: 'red'}}>{action.err}</p>
			);
		}

		return (
			<a className="list-group-item" onClick={this._onItemClicked}>
				<div style={content}>
					<div><span className={iconClass} style={icon} aria-hidden="true"></span>{action.title}</div>
					<button type="button" className="btn btn-default" disabled={!action.image}
									onClick={this._onOpenScreenshoot}>Screenshoot</button>
				</div>
				{errorView}
				<div style={{color: 'gray'}}>{action.date}</div>
			</a>
		);
	},
	_onOpenScreenshoot: function () {
		var action = this.props.action;
		window.open(location.pathname + 'reports/' + this.props.username + '/' + this.props.reportTitle + '/screenshoot/' + action.image, '_blank');
	}
});



