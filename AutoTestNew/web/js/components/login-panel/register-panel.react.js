var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		errorMsg: ReactPropTypes.string,
		creating: ReactPropTypes.bool
	},

	getInitialState: function () {
		return {
			username: '',
			password: '',
			confirmPassword: '',
			creating: false
		};
	},
	_onUsernameChanged: function (event) {
		this.setState({
			username: event.target.value,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			creating: this.state.creating
		});
	},
	_onPasswordChanged: function (event) {
		this.setState({
			username: this.state.username,
			password: event.target.value,
			confirmPassword: this.state.confirmPassword,
			creating: this.state.creating
		});
	},
	_onConfirmPasswordChanged: function (event) {
		this.setState({
			username: this.state.username,
			password: this.state.password,
			confirmPassword: event.target.value,
			creating: this.state.creating
		});
	},
	_onSubmit: function () {
		this.state.creating = true;
		this.setState(this.state);
		Dispatcher.register(this.state);
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
				'paddingTop': '15px',
				'justifyContent': 'space-between'
			},
			errorMsg: {
				'color': 'red',
				'paddingLeft': '50px'
			}
		};

		var state = this.state;

		return (
			<div className="panel panel-default" style={styles.content}>
			    <div className="panel-body">
					<div className="input-group">
						<span id="username" className="input-group-addon glyphicon glyphicon-user" aria-hidden="true" style={styles.icon}></span>
					  	<input type="text" className="form-control" placeholder="username"
					  		aria-describedby="username" value={state.username} onChange={this._onUsernameChanged} disabled={state.creating}/>
					</div>
					<div className="input-group">
					  	<span id="password" className="input-group-addon glyphicon glyphicon-lock" aria-hidden="true" style={styles.icon}></span>
					  	<input type="password" className="form-control" placeholder="password"
					  		aria-describedby="password" value={state.password} onChange={this._onPasswordChanged} disabled={state.creating}/>
					</div>
					<div className="input-group">
					  	<span id="password" className="input-group-addon glyphicon glyphicon-lock" aria-hidden="true" style={styles.icon}></span>
					  	<input type="password" className="form-control" placeholder="confirm password"
					  		aria-describedby="password" value={state.confirmPassword} onChange={this._onConfirmPasswordChanged} disabled={state.creating}/>
					</div>
		            <div style={styles.bottombar}>
		            	<div style={styles.errorMsg}>{state.errorMsg}</div>
			            <button type="button" className="btn btn-default" style={{marginLeft: '10px'}}
			            	disabled={!state.username || !state.password || state.password != state.confirmPassword || state.creating}
			            	onClick={this._onSubmit}>Submit</button>
		            </div>
			    </div>
			</div>
		);
	}
});





