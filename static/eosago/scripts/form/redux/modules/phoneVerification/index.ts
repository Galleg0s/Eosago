import {PhoneVerificarionState} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {SMS_RESEND_SECS} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {PhoneVerificationAction} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/phoneVerification/actions';
import {
	CODE_SEND_FAILURE,
	CODE_SEND_REQUEST, CODE_SEND_SUCCESS,
	PHONE_SEND_REQUEST,
	PHONE_SEND_SUCCESS, TIMER_TIK
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/phoneVerification/constants';


const initialState: PhoneVerificarionState = {
	repeatCounter: SMS_RESEND_SECS,
	didCodeRequested: false,
	isPhoneRequire: true,
	isCodeRequesting: false,
	didCodeSent: false,
	isCodeSending: false,
	isCodeValid: false,
};

export default function phoneVerificarionReducer(state = initialState, action: PhoneVerificationAction) {
	switch (action.type) {
		case PHONE_SEND_REQUEST:
			return {
				...state,
				isCodeRequesting: true,
			};
		case PHONE_SEND_SUCCESS:
			return {
				...state,
				repeatCounter: SMS_RESEND_SECS,
				didCodeRequested: true,
				isCodeRequesting: false,
				isPhoneRequire: action.payload.phone_require
			};
		//	TODO case PHONE_SEND_FAILURE
		case CODE_SEND_REQUEST:
			return {
				...state,
				isCodeSending: true,
			};
		case CODE_SEND_SUCCESS:
			return {
				...state,
				isCodeSending: false,
				isCodeValid: true,
				didCodeSent: true,
			};
		case CODE_SEND_FAILURE:
			return {
				...state,
				isCodeSending: false,
				isCodeValid: false,
				didCodeSent: true,
			};
		case TIMER_TIK:
			return {
				...state,
				repeatCounter: state.repeatCounter - 1,
			};
		default: {
			return {
				...state,
			};
		}
	}
}

export * from './constants';
export * from './actions';
export * from './selectors';
