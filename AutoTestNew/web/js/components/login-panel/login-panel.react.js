var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

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

	render: function () {
		var styles = {
			content: {
				'maxWidth': '400px',
				'minHeight': '160px',
				'margin': '0px 10px'
			},
			icon: {
				'fontSize': '16px'
			},
			bottombar: {
				'display': 'flex',
				'flexdirection': 'row',
				'justifyContent': 'space-between',
				'paddingTop': '15px'
			},
			errorMsg: {
				'color': 'red',
				'paddingLeft': '50px'
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
		            <div style={styles.bottombar}>
		            	<div style={styles.errorMsg}>{props.errorMsg}</div>
		            	<button type="button" className="btn btn-default right" disabled={!props.username || !props.password || props.loading} onClick={this._onLogin}>Signin</button>
		            </div>
			    </div>
			</div>
		);
	}
});





