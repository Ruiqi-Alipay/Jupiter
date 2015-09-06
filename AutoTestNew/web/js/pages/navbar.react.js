var React = require('react'),
	Link = require('react-router').Link,
	Store = require('../store'),
	classNames = require('classNames');

module.exports = React.createClass({

	contextTypes: {
		router: React.PropTypes.func
	},
	propTypes: {
		sectionId: React.PropTypes.string.isRequired
	},

	_onLogoutClicked: function (event) {
		localStorage.removeItem('session');
		Store.logOut();
		this.context.router.transitionTo('login');
	},

	render: function () {
		var navTabs = [
			{ id: 'script', to: 'dashboard', label: 'Scripts'},
			{ id: 'parameter', to: 'dashboard', label: 'Parameters'},
			{ id: 'package', to: 'dashboard', label: 'Packages'},
			{ id: 'report', to: 'dashboard', label: 'Reports'},
			{ id: 'guide', to: 'dashboard', label: 'Guide'}
		];
		var actionTabs = navTabs.map(function (tab) {
			var actionClass = classNames({
				active: tab.id == this.sectionId
			});
			return (<li key={tab.id} className={actionClass}><Link to={tab.to} params={{section_id: tab.id}}>{tab.label}</Link></li>);
		}, this.props);

		var session = localStorage.getItem('session');
		var username;
		if (session) {
			username = JSON.parse(session).username;
		}

		return (
			<nav className="navbar navbar-default navbar-fixed-top">
			  <div className="container-fluid">
			    <div className="navbar-header">
			      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
			        <span className="sr-only">Toggle navigation</span>
			        <span className="icon-bar"></span>
			        <span className="icon-bar"></span>
			        <span className="icon-bar"></span>
			      </button>
			      <a className="navbar-brand" href="#">Dashboard</a>
			    </div>

			    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			      <ul className="nav navbar-nav">
			        {actionTabs}
			      </ul>
			      <ul className="nav navbar-nav navbar-right">
			        <li onClick={this._onLogoutClicked}><a>(<span>{username}</span>) Logout</a></li>
			      </ul>
			    </div>
			  </div>
			</nav>
		);
	}
});

