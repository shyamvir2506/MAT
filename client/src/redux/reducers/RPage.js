import * as ActionTypes from '../actions/Types';


let month = new Date().getMonth();
month = month===0?1:month;

const initialState = {
	secretQuestions:['your pet name', 'your first company', 'your favourite color', 'your birth city', 'your favourite food'],
	page:'Dashboard',
	message:'',
	errorMsg:'',
	zone:'APAC (IND, ME)',
	quarter:'Q'+Math.ceil(month/3),
	loader:{show:false, msg:''},
	quarterList:["Q1", "Q2", "Q3", "Q4"],
	allZones:["APAC (IND, ME)", "APAC (SEA, AU, NZ)", "EU (SP, FR, UK, NDL, SA)", "US (East Coast-1)", "US (East Coast-2)", "US (West Coast)"],
	zoneList:[],
	yearsList:['2021','2022'],
	year:new Date().getFullYear().toString(),
	model:{show:false, child:'', data:null, callback:null},
	memberAssigned:undefined,
	teamList:[],
	arrReasons:["On AM request.", "Insufficient data.", "Mismatch between subsection & rationale.", "Revisit the gravity of rationale.", "Mismatch between rationale & Rating.", "Too many grammatical errors. Meaning of sentence not clear.",
				"Contradictory statements.", "Generalised statements.", "Rating missing.", "Sub rating missing."]
}

const RPage = (state=initialState, action) => {
	const {type, payload} = action;
	switch(type){
		case ActionTypes.SHOW_PAGE:
			return {
				...state,
				page:payload
			}
		
		case ActionTypes.SERVER_ERRORS:
			return {
				...state,
				errorMsg:'something went wrong'
			}
			
		case ActionTypes.ZONE_SELECTED:
			return {
				...state,
				zone:payload
			}
				
		case ActionTypes.QUARTER_SELECTED:
			return {
				...state,
				quarter:payload
			}
						
		case ActionTypes.YEAR_SELECTED:
			return {
				...state,
				year:payload
			}

		case ActionTypes.SHOW_LOADER:
			return {
				...state,
				loader:payload
			}

		case ActionTypes.SHOW_MODEL:
			return {
				...state,
				model:payload
			}

		case ActionTypes.MEMBER_ASSIGNED:
			return {
				...state,
				memberAssigned:payload
			}

		case ActionTypes.TEAM_LIST:
			return {
				...state,
				teamList:payload
			}

		case ActionTypes.UPDATE_QUARTER_LIST:
			return {
				...state,
				quarterList:payload
			}

		case ActionTypes.UDPATE_ZONE_LIST:
			return {
				...state,
				zoneList:payload
			}
		default:
			return state;
	}
}

export default RPage;
