import {
	CODE_SEND_FAILURE,
	CODE_SEND_REQUEST, CODE_SEND_SUCCESS,
	PHONE_SEND_REQUEST,
	PHONE_SEND_SUCCESS, TIMER_TIK
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/phoneVerification/constants';

export type PhoneVerificationAction =
	PhoneSendSuccessAction |
	PhoneSendRequestAction |
	TimerTikAction |
	CodeSendRequestAction |
	CodeSendSuccessAction |
	CodeSendFailureAction;

export interface PhoneSendRequestAction {
	type: PHONE_SEND_REQUEST,
}
export function phoneSendRequest() {
	return {
		type: PHONE_SEND_REQUEST,
	}
}

export interface PhoneSendSuccessPayload {
	phone_require: boolean
}
export interface PhoneSendSuccessAction {
	type: PHONE_SEND_SUCCESS,
	payload: PhoneSendSuccessPayload
}
export function phoneSendSuccess(payload: { phone_require: boolean }) {
	return {
		type: PHONE_SEND_SUCCESS,
		payload,
	};
}

export interface CodeSendRequestAction {
	type: CODE_SEND_REQUEST
}
export function codeSendRequest() {
	return {
		type: CODE_SEND_REQUEST,
	}
}

export interface CodeSendSuccessAction {
	type: CODE_SEND_SUCCESS,
}
export function codeSendSuccess() {
	return {
		type: CODE_SEND_SUCCESS,
	}
}

export interface CodeSendFailureAction {
	type: CODE_SEND_FAILURE,
	payload: Error,
}
export function codeSendFailure(e: Error) {
	return {
		type: CODE_SEND_FAILURE,
		payload: e,
	}
}

export interface TimerTikAction {
	type: TIMER_TIK,
}
export function timerTik() {
	return {
		type: TIMER_TIK,
	}
}
