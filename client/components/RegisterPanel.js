import CreateUserMutation from '../mutations/CreateUserMutation';

class RegisterPanel extends React.Component {
	state = {
		username: '',
		password: '',
		passwordRepeat: '',
		creating: false
	}
	_onUsernameChanged = (e) => {
		this.setState({
			username: e.target.value
		});
	}
	_onPasswordChanged = (e) => {
		this.setState({
			password: e.target.value
		});
	}
	_onConfirmPasswordChanged = (e) => {
		this.setState({
			passwordRepeat: e.target.value
		});
	}
	_onSubmit = () => {
		Relay.Store.update(new CreateUserMutation({
			user: this.props.user,
			username: this.state.username,
			password: this.state.password
		}));
	}
	render() {
		var panelStyle = {
			maxWidth: '400px',
			minHeight: '160px',
			margin: '0px 10px'
		};
		var iconStyle = {
			fontSize: '16px'
		};
		var bootomBar = {
			display: 'flex',
			flexdirection: 'row',
			paddingTop: '15px',
			justifyContent: 'space-between'
		};

		return (
			<div className="panel panel-default" style={panelStyle}>
			    <div className="panel-body">
					<div className="input-group">
						<span id="username" className="input-group-addon glyphicon glyphicon-user" aria-hidden="true" style={iconStyle}></span>
					  	<input type="text" className="form-control" placeholder="username"
					  		aria-describedby="username" value={this.state.username} onChange={this._onUsernameChanged} disabled={this.state.creating}/>
					</div>
					<div className="input-group">
					  	<span id="password" className="input-group-addon glyphicon glyphicon-lock" aria-hidden="true" style={iconStyle}></span>
					  	<input type="password" className="form-control" placeholder="password"
					  		aria-describedby="password" value={this.state.password} onChange={this._onPasswordChanged} disabled={this.state.creating}/>
					</div>
					<div className="input-group">
					  	<span id="password" className="input-group-addon glyphicon glyphicon-lock" aria-hidden="true" style={iconStyle}></span>
					  	<input type="password" className="form-control" placeholder="confirm password"
					  		aria-describedby="password" value={this.state.passwordRepeat} onChange={this._onConfirmPasswordChanged} disabled={this.state.creating}/>
					</div>
		            <div style={bootomBar}>
		            	<div>{this.state.errorMsg}</div>
			            <button type="button" className="btn btn-default" style={{marginLeft: '10px'}}
			            	disabled={!this.state.username || !this.state.password || this.state.password != this.state.passwordRepeat || this.state.creating}
			            	onClick={this._onSubmit}>Submit</button>
		            </div>
			    </div>
			</div>
		);
	}
}

export default Relay.createContainer(RegisterPanel, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				id,
				${CreateUserMutation.getFragment('user')}
			}
		`
	}
});
