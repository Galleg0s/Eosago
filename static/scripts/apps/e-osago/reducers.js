import { combineReducers } from 'redux';

import {
	SET_ACCIDENT_FREE,
	SET_CAR_PROP, SET_CAR_PROPS,
	SET_INSURANT_PROP, SET_INSURANT_PROPS,
	SET_OWNER_PROP, SET_OWNER_PROPS, CLEAR_OWNER,
	ADD_DRIVER, REMOVE_DRIVER, SET_DRIVER_PROP, SET_DRIVER_PROPS,
	SET_MULTIDRIVE, SET_OWNER_IS_AN_INSURANT, SET_SELECTED_STEP, SET_COMPANY_ID, SET_POLICIES_PROPS,
	SEND_FORM_DATA, SET_DEFAULT_PROPS, SET_RESULT, SET_RESULT_STATUS, SET_OFFER_PROP, SET_OFFER_PROPS,
	SMS_CODE_INVALID, VERIFY_PHONE_NUMBER, SET_PAYMENT_URL, CANCEL_RESULT, SET_TEST, SET_DID_RESULTS,
	SET_OSAGO_POLICY_START_DATE_MESSAGE, SET_ERRORS,
	SET_AGREEMENT_ID, SET_RGS_CODE, SET_RGS_CODE_ERROR, SET_PURCHASE_ID, SET_EOSAGO_PAGE,
} from './constants.js';
import { defaultState, testState } from './constants.js';

function formPropReducer(form = {}, action) {
	switch (action.type) {
		case SEND_FORM_DATA:
			return {
				...form,
				...{ isFormSubmitted: true }
			};
		case CANCEL_RESULT:
			return {
				...form,
				...{ isFormSubmitted: false },
				...{ paymentUrls: [] }
			};
		case SET_OWNER_IS_AN_INSURANT:
			return {
				...form,
				...{ ownerIsAnInsurant: action.params.value }
			};
		case SMS_CODE_INVALID:
			return {
				...form,
				...{ isSmsCodeInvalid: action.params.value }
			};
		case VERIFY_PHONE_NUMBER:
			return {
				...form,
				...{ isPhoneVerified: action.params.value }
			};
		case SET_SELECTED_STEP:
			return {
				...form,
				...{ selectedStepIndex: action.params.index }
			};
		case SET_MULTIDRIVE:
			return {
				...form,
				...{ multidrive: action.params.value }
			};
		case SET_ACCIDENT_FREE:
			return {
				...form,
				...{ accident_free: action.params.value }
			};
		case SET_OSAGO_POLICY_START_DATE_MESSAGE:
			return {
				...form,
				...{ osago_policy_start_date_message: action.params.value }
			};
		case SET_COMPANY_ID:
			return {
				...form,
				...{ company_id: action.params.id }
			};
		case SET_PAYMENT_URL:
			let paymentUrl = {};
			const isAlreadyGetPaymentUrl = form.paymentUrls.find(item => item.companyId === action.params.companyId);
			if (!isAlreadyGetPaymentUrl) {
				paymentUrl = { companyId: action.params.companyId, paymentUrl: action.params.paymentUrl };
				form.paymentUrls.push(paymentUrl);
			}
			return form;
		case SET_DID_RESULTS:
			return {
				...form,
				...{ didResultsUpdated: action.params.value }
			};
		case SET_ERRORS:
			return {
				...form,
				...{ partner_errors: action.params.partner_errors }
			};
		case SET_AGREEMENT_ID:
			return {
				...form,
				agreementId: action.params.agreementId
			};
		case SET_PURCHASE_ID:
			return {
				...form,
				purchaseId: action.params.purchaseId
			};
		case SET_EOSAGO_PAGE:
			return {
				...form,
				...{ eosagoPage: action.params.value }
			};
		case SET_DEFAULT_PROPS:
			return {
				...defaultState.form
			};
		default:
			return form;
	}
}

const rgsReducer = (rgs = {}, action) => {
	switch (action.type) {
		case SET_RGS_CODE:
			return {
				...rgs,
				code: {
					...rgs.code,
					value: action.params.code
				}
			};
		case SET_RGS_CODE_ERROR:
			return {
				...rgs,
				code: {
					...rgs.code,
					error: action.params.error
				}
			};
		default:
			return { ...rgs }
	}
};

function carPropReducer(car = {}, action) {
	switch (action.type) {
		case SET_CAR_PROP:
			return {
				...car,
				...{[action.params.prop]: action.params.value}
			};
		case SET_CAR_PROPS:
			return {
				...car,
				...action.params.data
			};
		case SET_DEFAULT_PROPS:
			return {
				...defaultState.car
			};
		case SET_TEST:
			return {
				...testState.car
			};
		default:
			return car;
	}
}

function insurantPropReducer(insurant = {}, action) {
	switch (action.type) {
		case SET_INSURANT_PROP:
			return {
				...insurant,
				...{[action.params.prop]: action.params.value}
			};
		case SET_INSURANT_PROPS:
			return {
				...insurant,
				...action.params.data
			};
		case SET_DEFAULT_PROPS:
			const { email, phone } = { ...insurant };
			return {
				...defaultState.insurant,
				email,
				phone
			};
		case SET_TEST:
			return {
				...testState.insurant
			};
		default:
			return insurant;
	}
}

function ownerPropReducer(owner = {}, action) {
	switch (action.type) {
		case SET_OWNER_PROP:
			return {
				...owner,
				...{[action.params.prop]: action.params.value}
			};
		case SET_OWNER_PROPS:
			return {
				...owner,
				...action.params.data
			};
		case SET_DEFAULT_PROPS:
			return {
				...defaultState.owner
			};
		case SET_TEST:
			return {
				...testState.owner
			};
		case CLEAR_OWNER:
			return {
				...defaultState.owner
			};
		default:
			return owner;
	}
}

function driversReducer(drivers = [], action) {
	switch (action.type) {
		case ADD_DRIVER:
			return [...drivers, { gender: 'm' }];
		case REMOVE_DRIVER: {
			let { index } = action.params;

			if (index === undefined) {
				index = drivers.length - 1;
			}

			return [
				...drivers.slice(0, index),
				...drivers.slice(index + 1)
			];
		}
		case SET_DRIVER_PROP:
			return drivers.map((item, idx) => {
				if (idx !== action.params.index) {
					return item;
				}

				return {
					...item,
					...{[action.params.prop]: action.params.value}
				};
			});
		case SET_DRIVER_PROPS:
			return drivers.map((item, idx) => {
				if (idx !== action.params.index) {
					return item;
				}

				return {
					...item,
					...action.params.data
				};
			});
		case SET_INSURANT_PROP:
			if (drivers.length === 1 && !action.params.accident_free) {
				return drivers.map((item) => {
					return {
						...item,
						...{[action.params.prop]: action.params.value}
					};
				});
			} else {
				return drivers;
			}
		case SET_INSURANT_PROPS:
			if (drivers.length === 1 && !action.params.accident_free) {
				return drivers.map((item) => {
					return {
						...item,
						...{[action.params.prop]: action.params.value}
					};
				});
			} else {
				return drivers;
			}
		case SET_DEFAULT_PROPS:
			return [
				...defaultState.drivers
			];
		case SET_TEST:
			return [
				...testState.drivers
			];
		default:
			return drivers;
	}
}

function resultsPropReducer(result = {}, action) {
	switch (action.type) {
		case SET_RESULT:
			return {
				...result,
				status: action.params.status,
				results: action.params.result || []
			};
		case SET_RESULT_STATUS:
			return {
				...result,
				status: action.params.status
			};
		case SET_DEFAULT_PROPS:
			return {
				...defaultState.result
			};
		default:
			return result;
	}
}

function policiesPropReducer(policies = {}, action) {
	switch (action.type) {
		case SET_POLICIES_PROPS:
			return {
				...policies,
				paperPolicy: action.params.paperPolicy,
				allPaperPolicies: action.params.allPaperPolicies,
				eosagoPolicies: action.params.eosagoPolicies,
			};
		case SET_DEFAULT_PROPS:
			return {
				...defaultState.policies
			};
		default:
			return policies;
	}
}

function offerPropReducer(offer = {}, action) {
	switch (action.type) {
		case SET_OFFER_PROP:
			return {
				...offer,
				...{[action.params.prop]: action.params.value}
			};
		case SET_OFFER_PROPS:
			return {
				...offer,
				...action.params.data
			};
		case SET_DEFAULT_PROPS:
			return {
				...defaultState.offer
			};
		default:
			return offer;
	}
}

const rootReducer = combineReducers({
	form: formPropReducer,
	car: carPropReducer,
	insurant: insurantPropReducer,
	owner: ownerPropReducer,
	drivers: driversReducer,
	result: resultsPropReducer,
	policies: policiesPropReducer,
	offer: offerPropReducer,
	rgs: rgsReducer,
});

export default rootReducer;
