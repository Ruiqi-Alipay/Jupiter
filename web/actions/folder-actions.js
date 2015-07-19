import { host, headers, finishAction, appendParams } from './action-common';
import {
	FOLDER_LIST,
	FOLDER_CREATE,
	FOLDER_UPDATE,
	FOLDER_DELETE
} from './action-types';

export function listFolders() {
	return dispatch => {
		var url = appendParams(host + '/api/folder', {
			sessionId: localStorage.getItem('session')
		});
		finishAction(fetch(url, {
			method: 'get',
			headers: headers
		}), FOLDER_LIST);
	};
}

export function createFolder(title) {
	return dispatch => {
		finishAction(fetch(host + '/api/folder', {
			method: 'post',
			headers: headers,
			body: JSON.stringify({
				title: title
			})
		}), FOLDER_CREATE);
	};
}

export function updateFolder(id, title) {
	return dispatch => {
		finishAction(fetch(host + '/api/folder/' + id, {
			method: 'put',
			headers: headers
		})
	};
}