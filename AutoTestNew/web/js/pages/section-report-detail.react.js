var React = require('react'),
	ReactPropTypes = React.PropTypes,
	ScriptListItem = require('../components/reportdetail/script-item.react'),
	ActionListItem = require('../components/reportdetail/action-item.react');

module.exports = React.createClass({

	propTypes: {
		report: ReactPropTypes.object,
		selectRecord: ReactPropTypes.string
	},
	contextTypes: {
		router: ReactPropTypes.func
	},

	getInitialState: function () {
		return {
			selectIndex: 0
		};
	},

	_onItemClicked: function (index) {
		this.setState({
			report: this.state.report,
			selectIndex: index
		});
	},
	_onBackClicked: function () {
		this.context.router.transitionTo(
			'dashboard', {section_id: 'report'});
	},

	render: function () {
		var styles = {
			list: {
				'overflowY': 'auto',
				'maxHeight': '500px'
			}
		};
		var report = this.props.report,
			selectIndex = this.state.selectIndex,
			view = this,
			scriptItemViews = '';

		if (report && report.content) {
			scriptItemViews = report.content.map(function (script, index) {
				return (
					<ScriptListItem
						key={index}
						index={index}
						title={script.title}
						success={script.success}
						select={selectIndex == index}
						clickFunc={view._onItemClicked}/>
				);
			});
		}

		var actionItemViews = '';
		if (report && report.content && report && report.content[this.state.selectIndex]) {
			var script = report.content[this.state.selectIndex];
			actionItemViews = script.actions.map(function (action, index) {
				return (
					<ActionListItem
						key={index}
						reportTitle={report.title}
						username={report.username}
						action={action}/>
				);
			});
		}

		var successCount = 0,
			failedCount = 0;
		if (report) {
			report.content.forEach(function (script) {
				script.success ? successCount++ : failedCount++;
			});
		}

		return (
			<div>
				<div className='row'>
					<div className='col-sm-10 col-sm-offset-1'>
						<div className="panel panel-default"
							style={{display: 'flex', flexDirection: 'row', padding: '8px 10px', alignItems: 'center', justifyContent: 'space-between'}}>
							<div style={{display: 'flex'}}>
								<button type="button" className="btn btn-warning"
									onClick={this._onBackClicked}>Back</button>
								<h4 style={{marginLeft: '20px'}}>{report ? report.title : ''}</h4>
							</div>
							<div style={{display: 'flex'}}>
								<h5><span className="label label-success">Success {successCount}</span></h5>
								<h5><span className="label label-danger">Failed {failedCount}</span></h5>
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col-sm-3 col-sm-offset-1'>
						<div className="panel panel-default" style={styles.list}>
							<ul className='list-group'>
								{scriptItemViews}
							</ul>
						</div>
					</div>
					<div className='col-sm-7'>
						<div className="panel panel-default">
							<ul className='list-group'>
								{actionItemViews}
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
});