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
	FETCH_POLICIES_REQUEST,
	FETCH_POLICIES_SUCCESS,
	FETCH_POLICIES_FAILURE,
	PAY_ORDER_REQUEST,
	PAY_ORDER_SUCCESS,
	PAY_ORDER_FAILURE,
	FETCH_CROSS_SALES_REQUEST,
	FETCH_CROSS_SALES_SUCCESS,
	FETCH_CROSS_SALES_FAILURE,
	FETCH_PAYMENT_INFO_REQUEST,
	FETCH_PAYMENT_INFO_SUCCESS,
	FETCH_PAYMENT_INFO_FAILURE,
	TOGGLE_CROSS_SALE_REQUEST,
	RESET_CROSS_SALES,
} from './constants';

const initialState = {
	isLoading: true,
	isFetchingPolicies: true,
	isFetchingPaymentInfo: false,
	isPaymentProcessing: false,
	isRecalculating: false,
	isFetchingCrossSales: false,
	policies: [],
	insurer: {},
	insuredList: [],
	insuranceAmount: 0,
	insuranceAmountCurrency: 'EUR',
	totalSum: 0,
	request: {
		countries: [],
	},
	diffSum: 0,
};

export default function purchaseReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_PAYMENT_RESULT_REQUEST:
		case FETCH_CALCULATION_RESULT_REQUEST:
			return {
				...state,
				isLoading: true,
			};
		case RECALCULATE_RESULT_SUCCESS:
		case FETCH_CALCULATION_RESULT_SUCCESS: {
			const {
				id,
				company,
				totalSum,
				calculateRequest,
				assistanceCompanies,
				insuranceAmount,
				insuranceAmountCurrency,
				companyOptions,
				guaranteedOptions,
				medicalFranchise,
			} = action.payload.result;
			return {
				...state,
				company,
				totalSum,
				assistanceCompanies,
				insuranceAmount,
				insuranceAmountCurrency,
				resultId: id,
				request: calculateRequest,
				'package': action.payload.result.package,
				options: [...companyOptions, ...guaranteedOptions],
				franchiseSum: medicalFranchise,
				isRecalculating: false,
				isLoading: false,
			};
		}
		case FETCH_PAYMENT_RESULT_FAILURE:
		case FETCH_CALCULATION_RESULT_FAILURE:
			return {
				...state,
				isLoading: false,
			};
		case FETCH_PAYMENT_RESULT_SUCCESS: {
			const {
				preliminaryResult: {
					id,
					assistanceCompanies,
					insuranceAmount,
					insuranceAmountCurrency,
					companyOptions,
					guaranteedOptions,
				},
				insurer,
				insuredList,
			} = action.payload.result.calculationReplicaArray.finalCalculateRequest;
			return {
				...state,
				insurer,
				insuredList,
				assistanceCompanies,
				insuranceAmount,
				insuranceAmountCurrency,
				preliminaryResultId: id,
				resultId: action.payload.result.id,
				company: action.payload.result.company,
				request: action.payload.result.calculateRequest,
				'package': action.payload.result.package,
				totalSum: action.payload.result.totalSum,
				franchiseSum: action.payload.result.medicalFranchise,
				options: companyOptions,
				isLoading: false,
			};
		}
		case FETCH_POLICIES_REQUEST:
			return {
				...state,
				isFetchingPolicies: true,
			};
		case FETCH_POLICIES_SUCCESS:
			return {
				...state,
				policies: action.payload,
				isFetchingPolicies: false,
			};
		case FETCH_POLICIES_FAILURE:
			return {
				...state,
				isFetchingPolicies: false,
			};
		case PAY_ORDER_REQUEST:
			return {
				...state,
				isPaymentProcessing: true,
			};
		case PAY_ORDER_SUCCESS:
			return {
				...state,
				isPaymentProcessing: false,
			};
		case PAY_ORDER_FAILURE:
			return {
				...state,
				isPaymentProcessing: false,
			};
		case RECALCULATE_RESULT:
			return {
				...state,
				crossSales: action.payload.refreshCrossSales ? [] : state.crossSales,
			};
		case RECALCULATE_RESULT_REQUEST:
			return {
				...state,
				isRecalculating: true,
			};
		case RECALCULATE_RESULT_FAILURE:
			return {
				...state,
				isRecalculating: false,
			};
		case FETCH_PAYMENT_INFO_REQUEST:
			return {
				...state,
				isFetchingPaymentInfo: true,
			};
		case FETCH_PAYMENT_INFO_SUCCESS:
			return {
				...state,
				isFetchingPaymentInfo: false,
				error: action.payload,
			};
		case FETCH_PAYMENT_INFO_FAILURE:
			return {
				...state,
				isFetchingPaymentInfo: false,
			};
		case FETCH_CROSS_SALES_REQUEST:
			return {
				...state,
				isRecalculating: true,
				isFetchingCrossSales: true
			};
		case FETCH_CROSS_SALES_SUCCESS:
			return {
				...state,
				crossSales: action.payload.result,
				isRecalculating: false,
				isFetchingCrossSales: false
			};
		case FETCH_CROSS_SALES_FAILURE:
			return {
				...state,
				isRecalculating: false,
				isFetchingCrossSales: false
			};
		case RESET_CROSS_SALES:
			return {
				...state,
				crossSales: [],
			};
		case TOGGLE_CROSS_SALE_REQUEST: {
			const toggledCrosSale = state
				.crossSales
				.find(item => item.option === action.payload.optionId);
			return {
				...state,
				totalSum: action.payload.actionType === 'add'
					? state.totalSum + toggledCrosSale.diffSum
					: state.totalSum - toggledCrosSale.diffSum,
			};
		}
		default:
			return state;
	}
}

export * from './actions';
export * from './constants';
export * from './selectors';
