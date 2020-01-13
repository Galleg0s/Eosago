import { normalize } from 'normalizr';
import router from 'router';
import {
	FETCH_CALCULATION_RESULT_REQUEST,
	FETCH_CALCULATION_RESULT_SUCCESS,
	FETCH_CALCULATION_RESULT_FAILURE,
	RECALCULATE_RESULT,
	RECALCULATE_RESULT_REQUEST,
	RECALCULATE_RESULT_SUCCESS,
	RECALCULATE_RESULT_FAILURE,
	FETCH_PAYMENT_RESULT_REQUEST,
	FETCH_PAYMENT_RESULT_SUCCESS,
	FETCH_PAYMENT_RESULT_FAILURE,
	FETCH_PAYMENT_INFO_REQUEST,
	FETCH_PAYMENT_INFO_SUCCESS,
	FETCH_PAYMENT_INFO_FAILURE,
	FETCH_POLICIES_REQUEST,
	FETCH_POLICIES_SUCCESS,
	FETCH_POLICIES_FAILURE,
	PAY_ORDER_REQUEST,
	PAY_ORDER_SUCCESS,
	PAY_ORDER_FAILURE,
	REDO_ORDER_PAYMENT_REQUEST,
	REDO_ORDER_PAYMENT_FAILURE,
	FETCH_CROSS_SALES_REQUEST,
	FETCH_CROSS_SALES_SUCCESS,
	FETCH_CROSS_SALES_FAILURE,
	TOGGLE_CROSS_SALE_REQUEST,
	TOGGLE_CROSS_SALE_SUCCESS,
	TOGGLE_CROSS_SALE_FAILURE,
	RESET_CROSS_SALES,
	ADD_CROSS_SALE_REQUEST,
	ADD_CROSS_SALE_SUCCESS,
	ADD_CROSS_SALE_FAILURE,
	REMOVE_CROSS_SALE_REQUEST,
	REMOVE_CROSS_SALE_FAILURE,
	REMOVE_CROSS_SALE_SUCCESS,
} from './constants';

import { calculationResultSchema, crossSaleSchema } from './schemas';

function processFinalCalculationInfoResponse({ payload }) {
	const { finalCalculateRequest: request } = payload.calculationReplicaArray;
	payload.calculateRequest = request.preliminaryResult.calculateRequest;
	payload.company = request.preliminaryResult.company;
	payload.package = request.preliminaryResult.package;
	return payload;
}

export function fetchCalculationResult(resultId) {
	return {
		types: [FETCH_CALCULATION_RESULT_REQUEST, FETCH_CALCULATION_RESULT_SUCCESS, FETCH_CALCULATION_RESULT_FAILURE],
		promise: api => api
			.fetchCalculationResult(resultId)
			.then(({ payload }) => normalize(payload, calculationResultSchema)),
	}
}

export function payOrder(resultId, data) {
	return {
		type: PAY_ORDER_REQUEST,
		payload: {
			resultId,
			data,
		},
	};
}

export function redoOrderPayment(resultId, data) {
	return {
		type: REDO_ORDER_PAYMENT_REQUEST,
		payload: {
			resultId,
			data,
		},
	}
}

export function redoOrderPaymentFailure(e) {
	return {
		type: REDO_ORDER_PAYMENT_FAILURE,
		payload: e,
	};
}

export function recalculateResult(resultId, refreshCrossSales = false) {
	return {
		type: RECALCULATE_RESULT,
		payload: {
			resultId,
			refreshCrossSales,
		},
	};
}

export function recalculateResultRequest(payload) {
	return {
		type: RECALCULATE_RESULT_REQUEST,
		payload,
	};
}

export function recalculateResultSuccess(payload) {
	return {
		type: RECALCULATE_RESULT_SUCCESS,
		payload,
	};
}

export function recalculateResultFailure(e) {
	return {
		type: RECALCULATE_RESULT_FAILURE,
		payload: e,
	};
}

export function fetchPaymentResult(resultId) {
	return {
		types: [FETCH_PAYMENT_RESULT_REQUEST, FETCH_PAYMENT_RESULT_SUCCESS, FETCH_PAYMENT_RESULT_FAILURE],
		promise: api => api.fetchFinalCalculationInfo(resultId)
			.then(processFinalCalculationInfoResponse)
			.then(res => normalize(res, calculationResultSchema)),
	}
}

export function fetchPaymentInfo(resultHash) {
	return {
		types: [FETCH_PAYMENT_INFO_REQUEST, FETCH_PAYMENT_INFO_SUCCESS, FETCH_PAYMENT_INFO_FAILURE],
		promise: api => api
			.fetchPaymentInfo(resultHash)
			.then(({ payload }) => payload.paymentData.actionCodeDescriptionUser),
	};
}

export function fetchPolicies(resultId, MAX_ATTEMPTS = 45) {
	const repeatCondition = ({ payload }, currentAttempt) => {
		if (payload.policies && payload.policies.length) {
			return false;
		}
		return currentAttempt < MAX_ATTEMPTS;
	};

	return {
		types: [FETCH_POLICIES_REQUEST, FETCH_POLICIES_SUCCESS, FETCH_POLICIES_FAILURE],
		promise: api => api
			.repeat(repeatCondition, 'fetchFinalCalculationInfo', resultId)
			.then(({ payload }) => {
				if (payload.policies.length) {
					return payload.policies;
				}
				return Promise.reject('Could not receive any policy');
			}),
	};
}

export function fetchCrossSales(resultId) {
	return {
		type: FETCH_CROSS_SALES_REQUEST,
		payload: {
			resultId,
		},
	};
}

export function fetchCrossSalesSuccess(payload) {
	return {
		type: FETCH_CROSS_SALES_SUCCESS,
		payload,
	};
}

export function fetchCrossSalesFailure(e) {
	return {
		type: FETCH_CROSS_SALES_FAILURE,
		payload: e,
	};
}

export function toggleCrossSale(actionType, resultId, requestId, optionId) {
	return {
		type: TOGGLE_CROSS_SALE_REQUEST,
		payload: {
			actionType,
			resultId,
			requestId,
			optionId,
		},
	};
}

export function toggleCrossSaleSuccess(payload) {
	return {
		type: TOGGLE_CROSS_SALE_SUCCESS,
		payload,
	};
}

export function toggleCrossSaleFailure(e) {
	return {
		type: TOGGLE_CROSS_SALE_FAILURE,
		payload: e,
	};
}

export function resetCrossSales() {
	return {
		type: RESET_CROSS_SALES,
	};
}
