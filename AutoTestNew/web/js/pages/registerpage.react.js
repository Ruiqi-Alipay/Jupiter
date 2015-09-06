var React = require('react'),
	Store = require('../store'),
	RegisterPanel = require('../components/login-panel/register-panel.react');

module.exports = React.createClass({
	
	contextTypes: {
		router: React.PropTypes.func
	},
	statics: {
		willTransitionTo: function (transition, params, query) {
			if (localStorage.getItem('session')) {
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
		var registerResult = Store.getRegisterResult();
		if (!registerResult.errorMsg) {
			this.context.router.transitionTo('login');
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

		var registerResult = Store.getRegisterResult();

		return (
			<div style={styles.body}>
				<div style={styles.content}>
					<h4 style={styles.brand}>User Registration</h4>
					<RegisterPanel
						errorMsg={registerResult.errorMsg}
						creating={registerResult.creating}/>
				</div>
			</div>
		);
	}
});


