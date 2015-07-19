import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';
import TestButton from './components/test-button';
import * as UserActions from './actions/user-actions';

@connect(state => ({
	user: state.user
}))
export default class Root extends Component {
	render() {
		const { user, dispatch } = this.props;
		return (
			<TestButton user={user}
					{...bindActionCreators(UserActions, dispatch)}/>
		);
	}
}