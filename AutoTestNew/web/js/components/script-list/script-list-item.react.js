var React = require('react'),
	ReactPropTypes = React.PropTypes;

module.exports = React.createClass({

	propTypes: {
		script: ReactPropTypes.object.isRequired
	},
	contextTypes: {
		router: React.PropTypes.func
	},

	_onItemClicked: function () {
		var script = this.props.script;
		this.context.router.transitionTo('dashboard', {section_id: 'script'},
			{select_folder: script.folder, select_script: script.id});
	},

	render: function () {
		var styles = {
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
		};

		var script = this.props.script;
		
		return (
			<a className='list-group-item' onClick={this._onItemClicked} style={styles.content}>
				<div><span className="glyphicon glyphicon-list-alt" style={styles.icon} aria-hidden="true"></span>{script.title}</div>
				<div>{script.date}</div>
			</a>
		);
	}
});