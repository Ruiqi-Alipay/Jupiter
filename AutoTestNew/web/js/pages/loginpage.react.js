var React = require('react'),
	Store = require('../store'),
	LoginPanel = require('../components/login-panel/login-panel.react');

module.exports = React.createClass({
	
	contextTypes: {
		router: React.PropTypes.func
	},
	statics: {
		willTransitionTo: function (transition, params, query) {
			if (localStorage.loginToken) {
				transition.redirect('dashboard', {section_id: 'script'});
			}
		}
	},

	componentDidMount: function () {
		Store.addAuthListener(this._onAuthChanged);
	},
	componentWillUnmount: function () {
		Store.removeAuthListener(this._onAuthChanged);
	},

	_onAuthChanged: function () {
		if (localStorage.loginToken) {
			this.context.router.transitionTo('dashboard', {section_id: 'script'});
		} else {
			this.forceUpdate();
		}
	},

	render: function () {
		var styles = {
			body: {
				'background': 'linear-gradient(to bottom,#ff8f00 0%,#ff6f00 100%)',
				'height': '100%'
			},
			brand: {
				'margin': '0px 0px',
				'textAlign': 'center',
				'paddingTop': '100px',
				'paddingBottom': '50px',
				'color': 'white'
			},
			content: {
				'height': '70%',
				'display': 'flex',
				'flexDirection': 'column',
				'justifyContent': 'center',
				'alignItems': 'center'
			}
		};

		var auth = Store.getAuthData();

		return (
			<div style={styles.body}>
				<div style={styles.content}>
					<h3 style={styles.brand}>Mobile Automation Test System</h3>
					<LoginPanel
						username={auth.username}
						password={auth.password}
						errorMsg={auth.errorMsg}
						loading={auth.loading}/>
				</div>
			</div>
		);
	}
});


