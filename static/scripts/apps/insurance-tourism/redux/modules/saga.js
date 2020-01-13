import { all, fork } from 'redux-saga/effects';
import searchSaga from './search/sagas';
import purchaseSaga from './purchase/sagas';

export default function* rootSaga() {
	yield all([
		// Sagas List
		fork(searchSaga),
		fork(purchaseSaga),
	]);
}
