var React = require('react'),
	ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
	contextTypes: {
		router: ReactPropTypes.func
	},
	propTypes: {
		folder: ReactPropTypes.object.isRequired,
		select: ReactPropTypes.bool.isRequired
	},
	getDefaultProps: function () {
		return {
			styles: {
				content: {
					'display': 'flex',
					'flexDirection': 'row',
					'justifyContent': 'space-between',
					'alignItems': 'center'
				},
				icon: {
					'fontSize': '16px',
					'marginRight': '10px'
				}
			}
		}
	},
	render: function () {
		var props = this.props,
			folder = props.folder,
			select = props.select,
			iconStyle = props.styles.icon,
			contentStyle = props.styles.content,
			iconClass = select ? 'glyphicon glyphicon-folder-open' : 'glyphicon glyphicon-folder-close',
			contentClass = select ? 'list-group-item active' : 'list-group-item';

		return (
				<a className={contentClass} style={contentStyle} onClick={this._onItemClicked}>
					<div><span className={iconClass} style={iconStyle} aria-hidden="true"></span>{folder.title}</div>
					<div><span className="badge">{folder.count}</span></div>
				</a>
		);
	},
	_onItemClicked: function () {
		this.context.router.transitionTo('dashboard', {section_id: 'script'}, {select_folder: this.props.folder.id});
	}
});



