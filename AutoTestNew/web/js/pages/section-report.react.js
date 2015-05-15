var React = require('react'),
	ReactPropTypes = React.PropTypes,
	ReportList = require('../components/report-list/report-list.react'),
	ReportConsole = require('../components/report-list/report-console.react');

module.exports = React.createClass({

	propTypes: {
		reports: ReactPropTypes.array,
		totalPage: ReactPropTypes.number,
		currentPage: ReactPropTypes.number
	},

	render: function () {
		return (
			<div className='row'>
				<div className='col-xs-10 col-xs-offset-1'>
					<ReportConsole totalPage={this.props.totalPage} currentPage={this.props.currentPage}/>
					<ReportList reports={this.props.reports}/>
				</div>
			</div>
		);
	}
});