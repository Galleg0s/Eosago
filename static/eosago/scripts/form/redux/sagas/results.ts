import { takeLatest, call, getContext, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import ApiClient from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/api';
import {
	policyRequestFailure,
	policyRequestStart,
	policyRequestSuccess,
	setRequestStatus,
	setResultInfoRequestStatus,
	policiesRequestSuccess
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/actions';
import {
	GET_RESULT_INFO_REQUEST,
	POLICY_PURCHASE_START,
	POLICY_REQUEST_START,
	RESULT_STATUSES,
	POLICY_REQUEST_SUCCESS,
	POLICY_STATUSES,
	REQUEST_STATUS,
	POLICY_REQUEST_FAILURE,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/constants';
import {
	PAYMENT_URL_REQUEST_DELAY,
	PAYMENT_URL_REQUEST_LIMIT,
	RESULT_INFO_REQUEST_DELAY,
	RESULT_INFO_URL_REQUEST_LIMIT,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';

import { AnyAction } from 'redux';
import addTrackingElement from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/tracking';
import { Policy, PolicyStatusName } from '../modules/results/types';

function* handlePurchaseStart(action: any) {
	try {
		const api: ApiClient = yield getContext('api');
		const { id, success }: any = yield call(api.startPurchase, action.payload.checkResult);

		if (success) {
			yield put(policyRequestStart(action.payload.companyId, id));
			yield put(setRequestStatus(REQUEST_STATUS.PENDING));
		} else {
			yield put(policyRequestFailure('Could not receive check result from server'));
			yield put(setRequestStatus(REQUEST_STATUS.REJECTED));
		}
	} catch (error) {
		yield put(policyRequestFailure(`Could not receive check result from server, ${ error }`));
		yield put(setRequestStatus(REQUEST_STATUS.REJECTED));
	}
}

function* handlePolicyRequestStart(action: any) {
	const api: ApiClient = yield getContext('api');

	try {
		const result = yield call(() =>
			api.repeat(
				'getPaymentUrl',
				(result: any) => result.status === 0,
				action.payload.policyId,
				PAYMENT_URL_REQUEST_DELAY,
				PAYMENT_URL_REQUEST_LIMIT
			)
			.then(result => result)
			.catch(error => {
				return {
					error: error,
				};
			})
		);

		if (result.status === 1) {
			yield put(policyRequestSuccess(action.payload.companyId, action.payload.policyId));
			yield put(setRequestStatus(REQUEST_STATUS.RESOLVED));

			window.location.href = result.info;
		} else {
			yield put(policyRequestFailure(`Could not receive payment url from server, ${result.error}`));
			yield put(setRequestStatus(REQUEST_STATUS.REJECTED));
		}
	} catch (error) {
		yield put(policyRequestFailure(`Could not receive payment url from server, ${error}`));
		yield put(setRequestStatus(REQUEST_STATUS.REJECTED));
	}
}

function* handleGetResultInfo(action: AnyAction) {
	const api: ApiClient = yield getContext('api');
	yield put(setResultInfoRequestStatus(REQUEST_STATUS.PENDING));
	for (
		let count = 0, status = RESULT_STATUSES.created;
		(count < RESULT_INFO_URL_REQUEST_LIMIT) && (status !== RESULT_STATUSES.finished);
		count++
	) {
		try {
			const response = yield call(() => api.getResultInfo(action.payload)
				.then(result => result)
				.catch(error => { throw error }
			));
			status = response.status;
			const statuses: Partial<Record<PolicyStatusName, Policy[]>> = {};
			const list: Policy[] = [];
			Object.keys(POLICY_STATUSES).forEach((statusName: PolicyStatusName) => statuses[statusName] = []);
			if (Array.isArray(response.result)) {
				response.result.forEach((policy: Policy) => {
					const hasNotSum = policy.status === POLICY_STATUSES.accept && !policy.premium_sum;
					const tooLongPending = (policy.status === POLICY_STATUSES.pending) && (status !== RESULT_STATUSES.pending);
					if (hasNotSum || tooLongPending) {
						policy.status = POLICY_STATUSES.decline;
						policy.status_title = 'decline';
					}
					statuses[policy.status_title]?.push(policy);
				})
				statuses.accept?.sort((a, b) => a.premium_sum - b.premium_sum);

				// Порядок вывода групп предложений
				list.push(...(statuses.accept as Policy[]));
				list.push(...(statuses.pending as Policy[]));
				list.push(...(statuses.decline as Policy[]));
			}
			yield put(policiesRequestSuccess(list));
			if (status === RESULT_STATUSES.finished) {
				yield put(setResultInfoRequestStatus(REQUEST_STATUS.RESOLVED));
				break;
			}
			yield delay(RESULT_INFO_REQUEST_DELAY * 1000);
		} catch (error) {
			yield put(setResultInfoRequestStatus(REQUEST_STATUS.REJECTED));
			break;
		}
	}
}

function* handlePolicyRequestSuccess(action: any) {
	const { companyId } = action.payload;

	addTrackingElement(['aff_c', 'offer_id', 'aff_id', 'url_id'], companyId);
	addTrackingElement(['sub_id', 'adv_sub'], companyId);
}

export default function* resultSaga() {
	yield takeLatest(POLICY_PURCHASE_START, handlePurchaseStart);
	yield takeLatest(POLICY_REQUEST_START, handlePolicyRequestStart);
	yield takeLatest(GET_RESULT_INFO_REQUEST, handleGetResultInfo);
	yield takeLatest(POLICY_REQUEST_SUCCESS, handlePolicyRequestSuccess);
}
