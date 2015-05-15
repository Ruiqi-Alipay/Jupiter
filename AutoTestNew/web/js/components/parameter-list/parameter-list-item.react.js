var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	contextTypes: {
		router: React.PropTypes.func
	},
	propTypes: {
		parameter: ReactPropTypes.object.isRequired
	},

	_onDeleteClicked: function (event) {
		Dispatcher.deleteParameter(this.props.parameter.id);
	},
	_onEditClicked: function (event) {
		this.context.router.transitionTo('dashboard', {section_id: 'parameter'}, {edit: this.props.parameter.id});
		$("html, body").animate({ scrollTop: 0 }, 300);
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
				'marginRight': '8px'
			}
		};
		var parameter = this.props.parameter;

		return (
			<a className='list-group-item'>
				<div style={styles.content}>
					<div style={styles.content}>
						<span className="glyphicon glyphicon-text-size" style={styles.leftIcon} aria-hidden="true"></span>
						<div>
							<div><span className="label label-default" style={styles.label}>Name</span>{parameter.name}</div>
							<div><span className="label label-default" style={styles.label}>Value </span>{parameter.value}</div>
						</div>
					</div>
					<div className="btn-group" role="group" aria-label="...">
						<button type="button" className="btn btn-default btn-sm" onClick={this._onEditClicked}>Change Value</button>
						<button type="button" className="btn btn-danger btn-sm" onClick={this._onDeleteClicked}>Delete</button>
					</div>
				</div>
			</a>
		);
	}
});



