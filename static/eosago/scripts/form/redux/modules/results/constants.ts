import {
	PolicyStatusValue,
	PolicyStatusName,
	RequestStatus
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/types';

export const POLICY_REQUEST_START = 'POLICY_REQUEST_START';
export const POLICY_REQUEST_SUCCESS = 'POLICY_REQUEST_SUCCESS';
export const POLICY_REQUEST_FAILURE = 'POLICY_REQUEST_FAILURE';
export const POLICY_PURCHASE_START = 'POLICY_PURCHASE_START';

export const POLICIES_REQUEST_START = 'POLICIES_REQUEST_START';
export const POLICIES_REQUEST_SUCCESS = 'POLICIES_REQUEST_SUCCESS';
export const POLICIES_REQUEST_FAILURE = 'POLICIES_REQUEST_FAILURE';

export const GET_RESULT_INFO_REQUEST = 'ins/eosago/GET_RESULT_INFO_REQUEST';
export type GET_RESULT_INFO_REQUEST = typeof GET_RESULT_INFO_REQUEST;

export const GET_RESULT_INFO_SUCCESS = 'ins/eosago/GET_RESULT_INFO_SUCCESS';
export type GET_RESULT_INFO_SUCCESS = typeof GET_RESULT_INFO_SUCCESS;

export const GET_RESULT_INFO_FAILURE = 'ins/eosago/GET_RESULT_INFO_FAILURE';
export type GET_RESULT_INFO_FAILURE = typeof GET_RESULT_INFO_FAILURE;

export const SET_REQUEST_STATUS = 'SET_REQUEST_STATUS';
export const SET_RESULT_INFO_REQUEST_STATUS = 'SET_RESULT_INFO_REQUEST_STATUS';

export const REQUEST_STATUS: Record<RequestStatus, RequestStatus> = {
	IDLE: 'IDLE',
	PENDING: 'PENDING',
	POLLING: 'POLLING',
	RESOLVED: 'RESOLVED',
	REJECTED: 'REJECTED',
};

export const POLICY_STATUSES: Record<PolicyStatusName, PolicyStatusValue> = {
	pending: 1,
	accept: 2,
	decline: 3,
};

export const RESULT_STATUSES = {
	created: 0,
	pending: 1,
	finished: 2,
};
