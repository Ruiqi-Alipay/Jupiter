var React = require('react'),
	ReportListItem = require('./report-list-item.react');

module.exports = React.createClass({

	propTypes: {
		reports: React.PropTypes.array
	},
	
	render: function () {
		var reportItemViews;

		if (this.props.reports) {
			reportItemViews = this.props.reports.map(function (report) {
				return (
					<ReportListItem key={report.id} report={report}/>
				);
			});
		}

		return (
			<div className="panel panel-default">
				<ul className='list-group'>
					{reportItemViews}
				</ul>
			</div>
		);
	}
});