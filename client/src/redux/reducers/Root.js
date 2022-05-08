import RPage from './RPage';
import RAuth from './RAuth';
import RDesigners from './RDesigners';
import RManagers from './RManagers';

const RootReducer = (state = {}, action) => {
    return {
		  default: RPage(state.default, action),
    	auth: RAuth(state.auth, action),
      designers:RDesigners(state.designers, action),
      managers:RManagers(state.managers, action)
    }
  }

export default RootReducer;