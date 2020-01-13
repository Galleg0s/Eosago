import { SEARCH_POLICIES_SUCCESS } from '../search';
import {
	FETCH_CALCULATION_RESULT_SUCCESS,
	FETCH_PAYMENT_RESULT_SUCCESS,
	RECALCULATE_RESULT_SUCCESS,
} from '../purchase/constants';

const initialState = {};

export default function companiesReducer(state = initialState, action) {
	switch (action.type) {
		case SEARCH_POLICIES_SUCCESS:
		case FETCH_CALCULATION_RESULT_SUCCESS:
		case FETCH_PAYMENT_RESULT_SUCCESS:
		case RECALCULATE_RESULT_SUCCESS:
			return action.payload.entities.companies || {};
		default:
			return state;
	}
}

export * from './schemas';
export * from './selectors';
