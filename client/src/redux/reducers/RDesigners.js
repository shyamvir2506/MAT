import * as ActionTypes from '../actions/Types';

const initialState = {
	designersList:[],
	designerSelected:undefined, // used in other feedback popup//
	designerName:'',
	designerData:null,
	removeDesiger:null,
	designerPublished:'',
	feedback:{},
	percent:0,
	previewGoal:false,
	otherFeedback:{reason:'', feedback:''},
	arrDesignerAssigned:[],
	designationList:['Designer - 1', 'Designer - 2', 'Sr. Designer - 1', 'Sr. Designer - 2', 'Sr. Developer - 1', 'Sr. Developer - 2']
}

const RDesigners = (state=initialState, action) => {
	const {type, payload} = action;
	switch(type){
		case ActionTypes.DESIGNER_SELECTED:
			return {
				...state,
				designerSelected:payload,
				otherFeedback:{reason:'', feedback:''},
				feedback:{}
			}

        case ActionTypes.DESIGNERS_COLLECTED:
            return {
                ...state,
                designersList:payload
            }

		case ActionTypes.DESIGNER_TO_REMOVE:
			return {
				...state,
				removeDesiger:payload
			}
		
		case ActionTypes.RESET_FEEDBACK:
			return {
				...state,
				feedback:null
			}
		
		case ActionTypes.CHANGE_FEEDBACK:
			return {
				...state,
				feedback:null
			}
				
		case ActionTypes.SAVE_FEEDBACK:
			return {
				...state,
				feedback:payload
			}
				
		case ActionTypes.RESET_OTHER_FEEDBACK:
			return {
				...state,
				otherFeedback:{reason:'', feedback:''}
			}
        				
		case ActionTypes.CHANGE_OTHER_FEEDBACK:
			return {
				...state,
				otherFeedback:payload
			}

		case ActionTypes.SAVE_OTHER_FEEDBACK:
			return {
				...state,
				otherFeedback:payload
			}

		case ActionTypes.CHANGE_GOAL_PERCENT:
			return {
				...state,
				percent:payload
			}
		
		case ActionTypes.DESIGNER_DATA_PUBLISHED:
			return {
				...state,
				designerPublished:payload
			}

		case ActionTypes.ASSIGN_DESIGNER:
			return {
				...state,
				arrDesignerAssigned:[...state.arrDesignerAssigned, payload]
			}
		
		case ActionTypes.PREVIEW_GOAL:
			return {
				...state,
				previewGoal:payload
			}

		default:
			return state;
	}
}

export default RDesigners;