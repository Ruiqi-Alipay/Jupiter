var React = require('react'),
	ReactPropTypes = React.PropTypes;

module.exports = React.createClass({

	propTypes: {
		report: ReactPropTypes.object.isRequired
	},

	_openExecutionReport: function () {
		window.open(location.pathname + 'reports/' + encodeURIComponent(this.props.report.title) + '/index.html', '_blank');
	},
	_openMemoryReport: function () {
		window.open(location.pathname + 'reporter#?title=' + encodeURIComponent(this.props.report.title) + '&type=memory', '_blank');
	},
	_openNetworkingReport: function () {
		window.open(location.pathname + 'reporter#?title=' + encodeURIComponent(this.props.report.title) + '&type=network', '_blank');
	},
	_openCPUReport: function () {
		window.open(location.pathname + 'reporter#?title=' + encodeURIComponent(this.props.report.title) + '&type=cpu', '_blank');
	},
	
	render: function () {
		var styles = {
			content: {
				'display': 'flex',
				'flexDirection': 'row',
				'justifyContent': 'space-between',
				'alignItems': 'center',
			},
			bottomBar: {
				'display': 'flex',
				'flexDirection': 'row',
				'justifyContent': 'flex-end',
				'alignItems': 'center',
				'paddingTop': '8px'
			},
			leftIcon: {
				'fontSize': '16px',
				'marginRight': '10px'
			}
		};

		var report = this.props.report;

		return (
			<a className='list-group-item'>
				<div style={styles.content}>
					<div><span className="glyphicon glyphicon-list-alt" style={styles.leftIcon} aria-hidden="true"></span>{report.title}</div>
					<div>{report.date}</div>
				</div>
				<div style={styles.bottomBar}>
					<div className="btn-group" role="group" aria-label="...">
						<button type="button" className="btn btn-default btn-sm" onClick={this._openExecutionReport}>Execution Report</button>
						<button type="button" className="btn btn-default btn-sm" onClick={this._openMemoryReport}>Memory Report</button>
						<button type="button" className="btn btn-default btn-sm" onClick={this._openNetworkingReport}>Networking Report</button>
						<button type="button" className="btn btn-default btn-sm" onClick={this._openCPUReport}>CPU Report</button>
					</div>
				</div>
			</a>
		);
	}
});



