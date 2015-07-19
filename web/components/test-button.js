import React, { Component, PropTypes } from 'react';

export default class TestButton extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		signIn: PropTypes.func.isRequired
	};

	render() {
		const { user, signIn } = this.props;
		const display = JSON.stringify(user);
		return (
			<p>
				<div>{user ? user.message : 'user'}</div>
				<button onClick={this._onClick.bind(this)}>SIGNIN</button>
			</p>
		);
	}

	_onClick(e) {
		this.props.signIn('testname', 'testpassword');
	}
}