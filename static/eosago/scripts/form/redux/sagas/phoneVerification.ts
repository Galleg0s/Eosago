import {getContext, call, put, takeLatest, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {SMS_RESEND_SECS} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import ApiClient from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/api';
import {
	CODE_SEND_REQUEST,
	codeSendFailure,
	codeSendSuccess,
	PHONE_SEND_REQUEST,
	phoneSendSuccess,
	timerTik
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/phoneVerification';
import {PhoneVerificationFieldNames, State} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {selector} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form';

function* startTimer(count = SMS_RESEND_SECS): any { // TODO fix any
	if (count > 0) {
		yield put(timerTik());
		yield delay(1000);
		yield startTimer(count - 1);
	}
}

function* phoneSend(phone: string) {
	try {
		const api: ApiClient = yield getContext('api');
		const {success, phone_require} = yield call(api.requestVerificationCode, phone);
		if (success) {
			yield put(phoneSendSuccess({ phone_require }));
			yield startTimer();
		} else {
			console.error('Не удалось отправить код');
		}
	} catch (e) {
		console.error(e);
	}
}

function* codeSend(code: string) {
	try {
		const api: ApiClient = yield getContext('api');
		const { valid } = yield call(api.sendVerificationCode, code);
		if (valid) {
			yield put(codeSendSuccess())
		} else {
			yield put(codeSendFailure(new Error('Не удалось подтвердить телефон.')));
			console.error('Не удалось подтвердить телефон.');
		}
	} catch (e) {
		console.error(e);
	}
}

function* handlePhoneSendRequest() {
	const state: State = yield select();
	const phone = yield selector(state, PhoneVerificationFieldNames.phone);
	yield phoneSend(phone);
}

function* handleCodeSendRequest() {
	const state: State = yield select();
	const code = yield selector(state, PhoneVerificationFieldNames.code);
	yield codeSend(code);
}

export default function* phoneVerificationSaga() {
	yield takeLatest(PHONE_SEND_REQUEST, handlePhoneSendRequest);
	yield takeLatest(CODE_SEND_REQUEST, handleCodeSendRequest);
}
