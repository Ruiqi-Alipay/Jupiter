var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		packageApk: ReactPropTypes.object.isRequired
	},

	_onDeleteClicked: function (event) {
		Dispatcher.deletePackage(this.props.packageApk.id);
	},

	render: function () {
		var styles = {
			content: {
				'display': 'flex',
				'flexDirection': 'row',
				'justifyContent': 'space-between',
				'alignItems': 'center',
			},
			leftIcon: {
				'fontSize': '16px',
				'marginRight': '10px'
			},
			label: {
				'marginRight': '10px'
			}
		};
		var packageApk = this.props.packageApk;

		return (
			<a className='list-group-item'>
				<div style={styles.content}>
					<div style={styles.content}>
						<span className="glyphicon glyphicon-phone" style={styles.leftIcon} aria-hidden="true"></span>
						<div>
							<div><span className="label label-default" style={styles.label}>Package Name</span>{packageApk.name}</div>
							<div><span className="label label-default" style={styles.label}>Description</span>{packageApk.description}</div>
						</div>
					</div>
					<div className="btn-group" role="group" aria-label="...">
						<button type="button" className="btn btn-danger btn-sm" onClick={this._onDeleteClicked}>Delete</button>
					</div>
				</div>
			</a>
		);
	}
});



