import {
	AUTH_ERROR, USER_LOADED,
	REGISTER_FAIL, REGISTER_SUCCESS,
	LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, FORGET_PASS_FAIL, FORGET_PASS_SUCCESS
} from '../actions/Types';

const initialState = {
	token:localStorage.getItem('token'),
	user:null,
	userType:'manager',
	serverError:'',
	passwordReset:false
}

const RAuth = (state=initialState, action) => {
	const {type, payload} = action;
	switch(type){
		case USER_LOADED:
			return{
				...state,
				user:payload,
				userType:payload.type
			}
		
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem('token', payload.token);
			return {
				...state,
				token:payload.token
			}
		
		case REGISTER_FAIL:
		case LOGIN_FAIL:
		case AUTH_ERROR:
		case LOGOUT:
		case FORGET_PASS_FAIL:
			localStorage.removeItem('token');
			return {
				...state,
				token:null,
				user:null,
				userType:null,
				serverError:payload,
				passwordReset:false
			}

		case FORGET_PASS_SUCCESS:
			return {
				...state,
				passwordReset:true
			}

		default:
			return state;
	}
}

export default RAuth;