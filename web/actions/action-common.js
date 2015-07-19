import 'whatwg-fetch';

const host = 'http://localhost:8080';
const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

export function makeRequest(path, method, params, body) {
	fetch(host + '/api/folder', {
		method: 'post',
		headers: headers,
		body: JSON.stringify({
			title: title
		})
	}
	promise.then(res => dispatch({
		type: action,
		data: res.json()
	}))
	.catch(err => dispatch({
		type: action,
		err: err
	}));
}

export function appendParams(urlAddress, params) {
	var url = new URL(urlAddress);
	Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
	return url;
};