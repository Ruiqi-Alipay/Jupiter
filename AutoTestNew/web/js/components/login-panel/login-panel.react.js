var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	contextTypes: {
		router: React.PropTypes.func
	},
	propTypes: {
		username: ReactPropTypes.string,
		password: ReactPropTypes.string,
		errorMsg: ReactPropTypes.string,
		loading: ReactPropTypes.bool
	},

	_onUsernameChanged: function (event) {
		Dispatcher.authDataChanged({ username: event.target.value });
	},
	_onPasswordChanged: function (event) {
		Dispatcher.authDataChanged({ password: event.target.value });
	},
	_onLogin: function () {
		Dispatcher.login();
	},
	_onRegister: function () {
		this.context.router.transitionTo('register');
	},

	render: function () {
		var styles = {
			content: {
				'maxWidth': '400px',
				'minHeight': '180px',
				'margin': '0px 10px'
			},
			icon: {
				'fontSize': '16px'
			},
			errorMsg: {
				'color': 'red',
				'paddingLeft': '50px',
				'minHeight': '30px'
			}
		};

		var props = this.props;

		return (
			<div className="panel panel-default" style={styles.content}>
			    <div className="panel-body">
					<div className="input-group">
						<span id="username" className="input-group-addon glyphicon glyphicon-user" aria-hidden="true" style={styles.icon}></span>
					  	<input type="text" className="form-control" placeholder="username"
					  		aria-describedby="username" value={props.username} onChange={this._onUsernameChanged} disabled={props.loading}/>
					</div>
					<div className="input-group">
					  	<span id="password" className="input-group-addon glyphicon glyphicon-lock" aria-hidden="true" style={styles.icon}></span>
					  	<input type="password" className="form-control" placeholder="password"
					  		aria-describedby="password" value={props.password} onChange={this._onPasswordChanged} disabled={props.loading}/>
					</div>
					<div style={styles.errorMsg}>{props.errorMsg}</div>
		            <div className="row">
		            	<button type="button" className="btn btn-default col-sm-3 col-sm-offset-5" disabled={props.loading}
		            		onClick={this._onRegister}>Register</button>
		            	<button type="button" className="btn btn-default col-sm-3" style={{marginLeft: '10px'}}
		            		disabled={!props.username || !props.password || props.loading} onClick={this._onLogin}>Signin</button>
		            </div>
			    </div>
			</div>
		);
	}
});





