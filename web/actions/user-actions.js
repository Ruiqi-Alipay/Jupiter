import 'whatwg-fetch';
import { host, headers, finishAction } from './action-common';
import {
	USER_SIGNIN,
	USER_REGISTER
} from './action-types';

export function signIn(username, password) {
	return dispatch => {
		finishAction(fetch(host + '/api/user/signin', {
			method: 'post',
			headers: headers,
			body: JSON.stringify({
				username: username,
				password: password,
			})
		}), USER_SIGNIN);
	};
}

export function register(username, password) {
	return dispatch => {
		finishAction(fetch(host + '/api/user', {
			method: 'post',
			headers: headers,
			body: JSON.stringify({
				username: username,
				password: password
			})
		}), USER_REGISTER);
	};
}