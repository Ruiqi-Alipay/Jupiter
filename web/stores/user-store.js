import { USER_SIGNIN } from '../actions/action-types';

export default function (state = {}, action) {
	switch(action.type) {
		case USER_SIGNIN:			
			return action.err;
	}
}