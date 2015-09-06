var React = require('react'),
	Store = require('../store'),
	Navbar = require('./navbar.react'),
	Dispatcher = require('../dispatcher').utils,
	ScriptSection = require('./section-script.react'),
	ScriptDetail = require('./section-script-detail.react'),
	ParameterSection = require('./section-parameter.react'),
	PackageSection = require('./section-package.react'),
	ReportSection = require('./section-report.react'),
	ReportDetail = require('./section-report-detail.react'),
	GuideSection = require('./section-guide.react');

module.exports = React.createClass({

	contextTypes: {
		router: React.PropTypes.func
	},
	statics: {
		willTransitionTo: function (transition, params, query) {
			if (!localStorage.getItem('session')) {
				transition.redirect('/login', {}, {'nextPath' : transition.path});
				return;
			}
			
			switch (params.section_id) {
				case 'script':
					if (query.select_script) {
						var data = Store.getScriptDetailData(query.select_folder, query.select_script);
						if (!data.script) {
							Dispatcher.loadScript(query.select_script);
						} else if (!data.script.id) {
							Dispatcher.loadConfigScripts();
						}
					} else {
						var data = Store.getScriptListData();
						if (!data.folders) {
							Dispatcher.loadFolders();
						}
						if (query.select_folder) {
							Dispatcher.loadScripts(query.select_folder);
						} else {
							Store.clearScripts();
						}
					}
					break;
				case 'parameter':
					var data = Store.getParameterData();
					if (!data.parameters) {
						Dispatcher.loadParameters();
					}
					break;
				case 'package':
					var data = Store.getPackageData();
					if (!data.packages) {
						Dispatcher.loadPackages();
					}
					break;
				case 'report':
					if (query.select_report) {
						var report = Store.getReportDetailData(query.select_report);
						if (!report) {
							Dispatcher.loadReport(query.select_report);
						}
					} else {
						var data = Store.getReportData();
						if (!data.reports) {
							Dispatcher.loadReports(query.page);
						}
					}
					break;
			}
		}
	},

	componentDidMount: function () {
		Store.addDashboardDataListener(this._onDataChanged);
	},
	componentWillUnmount: function () {
		Store.removeDashboardDataListener(this._onDataChanged);
	},
	componentWillUpdate: function (nextProps, nextState) {
		var transition = Store.getPenndingTransition();
		if (transition) {
			this.context.router.transitionTo(transition.name, transition.params, transition.query);
			return;
		}
	},

	_onDataChanged: function () {
		this.forceUpdate();
	},

	render: function () {
		var contentStyle = {
			'position': 'relative',
			'paddingTop': '84px',
			'height': '100%',
			'width': '100%'
		};

		var params = this.props.params,
			query = this.props.query,
			sectionView;

		switch(params.section_id) {
			case 'script':
				if (query.select_script) {
					var data = Store.getScriptDetailData(query.select_folder, query.select_script),
						message = Store.getResponseMessage(query.select_script);

					sectionView = (<ScriptDetail
										script={data.script}
										folders={data.folders}
										configScripts={data.configScripts}
										folderScripts={data.folderScripts}
										message={message}/>);
				} else {
					var data = Store.getScriptListData();
					sectionView = (<ScriptSection
										searchText={data.searchText}
										folders={data.folders}
										scripts={data.scripts}
										selectFolderId={query.select_folder}
										editTitle={query.editTitle}/>);
				}
				break;
			case 'parameter':
				var data = Store.getParameterData();
				sectionView = (<ParameterSection
									searchText={data.searchText}
									parameters={data.parameters}
									edit_id={query.edit}/>);
				break;
			case 'package':
				var data = Store.getPackageData();
				sectionView = (<PackageSection
									packages={data.packages}/>);
				break;
			case 'report':
				if (query.select_report) {
					var report = Store.getReportDetailData(query.select_report);
					sectionView = (<ReportDetail report={report}/>);
				} else {
					var data = Store.getReportData();
					sectionView = (<ReportSection
										reports={data.reports}
										totalPage={data.totalPage > 0 ? parseInt(data.totalPage) : 0}
										currentPage={data.currentPage >= 0 ? parseInt(data.currentPage) : 0}/>);
				}
				break;
			case 'guide':
				sectionView = (<GuideSection/>);
				break;
		}

		return (
			<div style={contentStyle}>
				<Navbar sectionId={params.section_id}/>
				{sectionView}
			</div>
		);
	}
});