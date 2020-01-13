// @todo после получения офферов (INS-4341) заменить на реальные данные
import {
	POLICY_PURCHASE_START,
	POLICY_REQUEST_FAILURE,
	POLICY_REQUEST_START,
	POLICY_REQUEST_SUCCESS,
	REQUEST_STATUS,
	SET_REQUEST_STATUS,
	SET_RESULT_INFO_REQUEST_STATUS,
	POLICIES_REQUEST_START,
	POLICIES_REQUEST_SUCCESS,
	POLICIES_REQUEST_FAILURE,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/constants';

const initialState: any = {
	requestStatus: REQUEST_STATUS.IDLE,
	resultInfoRequestStatus: REQUEST_STATUS.IDLE,
	paymentUrl: '',
	policies: [],
};

export default function resultsReducer(state = initialState, action: any) {
	switch (action.type) {
		case POLICY_PURCHASE_START:
			return {
				...state,
				checkResult: action.payload.checkResult,
				companyId: action.payload.companyId,
			};
		case POLICY_REQUEST_START:
			return {
				...state,
				companyId: action.payload.companyId,
				policyId: action.payload.policyId,
			};
		case POLICY_REQUEST_SUCCESS:
			return {
				...state,
				companyId: action.payload.companyId,
				policyId: action.payload.policyId,
			};
		case POLICY_REQUEST_FAILURE:
			return {
				...state,
				error: action.payload,
			};
		case POLICIES_REQUEST_START:
			return {
				...state,
			};
		case POLICIES_REQUEST_SUCCESS:
			return {
				...state,
				policies: action.payload,
			};
		case POLICIES_REQUEST_FAILURE:
			return {
				...state,
				error: action.payload,
			};
		case SET_REQUEST_STATUS:
			return {
				...state,
				requestStatus: action.payload,
			};
		case SET_RESULT_INFO_REQUEST_STATUS:
			return {
				...state,
				resultInfoRequestStatus: action.payload,
			};
		default:
			return { ...state };
	}
}
