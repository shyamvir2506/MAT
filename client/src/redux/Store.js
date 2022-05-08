import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import Root from './reducers/Root';

const middleware = [thunk];
const Store = createStore(
	Root,
	applyMiddleware(...middleware)
);
export default Store;