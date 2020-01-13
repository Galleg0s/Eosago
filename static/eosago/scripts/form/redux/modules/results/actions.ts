import {
	GET_RESULT_INFO_FAILURE,
	GET_RESULT_INFO_REQUEST, GET_RESULT_INFO_SUCCESS,
	POLICY_PURCHASE_START,
	POLICY_REQUEST_FAILURE,
	POLICY_REQUEST_START,
	POLICY_REQUEST_SUCCESS,
	SET_REQUEST_STATUS,
	SET_RESULT_INFO_REQUEST_STATUS,
	POLICIES_REQUEST_START,
	POLICIES_REQUEST_SUCCESS,
	POLICIES_REQUEST_FAILURE,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/constants';
import { Policy } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/types';

export const purchaseStart = (companyId: string, checkResult: string) => {
	return {
		type: POLICY_PURCHASE_START,
		payload: {
			companyId,
			checkResult,
		},
	}
};

export const policiesRequestStart = () => {
	return {
		type: POLICIES_REQUEST_START,
	}
};

export const policiesRequestFailure = (error: string) => {
	return {
		type: POLICIES_REQUEST_FAILURE,
		payload: error,
	}
};

export const policiesRequestSuccess = (list: Policy[]) => {
	return {
		type: POLICIES_REQUEST_SUCCESS,
		payload: list,
	}
};

export const policyRequestStart = (companyId: string, policyId: string) => {
	return {
		type: POLICY_REQUEST_START,
		payload: {
			companyId,
			policyId,
		},
	}
};

export const policyRequestFailure = (error: string) => {
	return {
		type: POLICY_REQUEST_FAILURE,
		payload: error,
	}
};

export const policyRequestSuccess = (companyId: string, policyId: string) => {
	return {
		type: POLICY_REQUEST_SUCCESS,
		payload: {
			companyId,
			policyId,
		},
	}
};

export const setResultInfoRequestStatus = (status: string) => {
	return {
		type: SET_RESULT_INFO_REQUEST_STATUS,
		payload: status,
	}
};

export const setRequestStatus = (status: string) => {
	return {
		type: SET_REQUEST_STATUS,
		payload: status,
	}
};

export const getResultInfo = (id: number) => ({
	type: GET_RESULT_INFO_REQUEST,
	payload: id
});

export const getResultInfoSuccess = (offers: any[]) => ({
	type: GET_RESULT_INFO_SUCCESS,
	payload: offers
});

export const getResultInfoFailure = (e: Error) => ({
	type: GET_RESULT_INFO_FAILURE,
	payload: e,
});
