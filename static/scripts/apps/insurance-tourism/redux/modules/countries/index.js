import { FETCH_COUNTRIES_SUCCESS } from './constants';
import {
	FETCH_CALCULATION_RESULT_SUCCESS,
	FETCH_PAYMENT_RESULT_SUCCESS,
	RECALCULATE_RESULT_SUCCESS,
} from '../purchase/constants';

const initialState = {};

export default function countriesReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_COUNTRIES_SUCCESS:
		case FETCH_CALCULATION_RESULT_SUCCESS:
		case FETCH_PAYMENT_RESULT_SUCCESS:
		case RECALCULATE_RESULT_SUCCESS:
			return action.payload.entities.countries || {};
		default:
			return state;
	}
}

export * from './constants';
export * from './actions';
export * from './selectors';
export * from './schemas';
