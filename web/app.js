import React, { Component } from 'react';
import Root from './root';
import { createRedux } from 'redux';
import { Provider } from 'redux/react';
import * as stores from './stores';

const redux = createRedux(stores);

export default class Application extends Component {
	render() {
		return (
			<Provider redux={redux}>
				{() => <Root />}
			</Provider>
		);
	}
}