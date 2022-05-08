import * as ActionTypes from '../actions/Types';

const initialState = {
	amList:[],
	astManager:''
}

const RManagers = (state=initialState, action) => {
	const {type, payload} = action;
	switch(type){
		case ActionTypes.AST_MANAGERS_COLLECTED:
			return {
				...state,
				amList:payload
			}

        case ActionTypes.AM_SELECTED:
            return {
                ...state,
                astManager:payload
            }

		default:
			return state;
	}
}

export default RManagers;