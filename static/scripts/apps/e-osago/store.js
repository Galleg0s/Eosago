import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers.js';

import { defaultState} from './constants.js';
import ApiClient from './api';

const api = new ApiClient();

let store = applyMiddleware(thunk.withExtraArgument({ api }))(createStore)(
	rootReducer,
	defaultState,
	/** for development only */
	process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

export default store;
