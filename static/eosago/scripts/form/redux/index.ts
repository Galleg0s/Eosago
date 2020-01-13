import { createHashHistory } from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/sagas/index';
import rootReducer from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/reducer';
import ApiClient from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/api';

export const history = createHashHistory();

function configureStore(busUrl: string) {
	const api = new ApiClient({ busUrl });
	const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const sagaMiddleware = createSagaMiddleware({
		context: { api },
	});

	const store: any = createStore(
		connectRouter(history)(rootReducer),
		composeEnhancer(
			applyMiddleware(
				// router
				routerMiddleware(history),
				// saga
				sagaMiddleware,
			),
		)
	);

	sagaMiddleware.run(rootSaga);
	return store;
}

export default configureStore;
