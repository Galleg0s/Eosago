import { SEARCH_POLICIES_SUCCESS } from '../search';
import {
	FETCH_CALCULATION_RESULT_SUCCESS,
	FETCH_PAYMENT_RESULT_SUCCESS,
	RECALCULATE_RESULT_SUCCESS,
} from '../purchase';

const initialState = {};

export default function resultsReducer(state = initialState, action) {
	switch (action.type) {
		case SEARCH_POLICIES_SUCCESS:
		case FETCH_CALCULATION_RESULT_SUCCESS:
		case FETCH_PAYMENT_RESULT_SUCCESS:
		case RECALCULATE_RESULT_SUCCESS:
			return action.payload.entities.results || {};
		default:
			return state;
	}
}

export * from './schemas';
export * from './selectors';
