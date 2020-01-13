import { all, fork } from 'redux-saga/effects';
import formActionSaga from 'redux-form-saga';
import formStepsSaga from './formSteps';
import phoneVerification from './phoneVerification';
import autoCatalog from './autoCatalog';
import formSaga from './form';
import auto from './auto';
import resultsSaga from './results';

export default function* rootSaga() {
	yield all([
		// Sagas List
		fork(formActionSaga),
		fork(formStepsSaga),
		fork(phoneVerification),
		fork(autoCatalog),
		fork(formSaga),
		fork(auto),
		fork(resultsSaga),
	]);
}
