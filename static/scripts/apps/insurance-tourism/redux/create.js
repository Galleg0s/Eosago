import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'
import clientMiddleware from './middleware/clientMiddleware';
import rootReducer from './modules/reducer';
import rootSaga from './modules/saga';

export default function configureStore(api, initialState = {}) {
	const sagaMiddleware = createSagaMiddleware({
		context: { api },
	});
	const middleware = [
		thunk.withExtraArgument({ api }),
		clientMiddleware(api),
		sagaMiddleware,
	];
	let enhancer;

	if (process.env.NODE_ENV !== 'production') {
		middleware.push(
			createLogger({
				collapsed: true,
			}),
		);
	}
	enhancer = applyMiddleware(...middleware);

	const store = createStore(rootReducer, initialState, enhancer);

	// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
	if (process.env.NODE_ENV !== 'production' && module.hot) {
		module.hot.accept('./modules/reducer', () =>
			// eslint-disable-next-line global-require
			store.replaceReducer(require('./modules/reducer').default),
		);
	}

	sagaMiddleware.run(rootSaga);

	return store;
}
