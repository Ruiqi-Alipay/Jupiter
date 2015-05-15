var React = require('react'),
	ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
	contextTypes: {
		router: ReactPropTypes.func
	},
	render: function () {
		return (
			<div className="panel panel-default" onClick={this._onCreateFolderClicked}>
				<a className='list-group-item'>NEW FOLDER</a>
			</div>
		);
	},
	_onCreateFolderClicked: function (event) {
		this.context.router.transitionTo('dashboard', {section_id: 'script'});
	}
});