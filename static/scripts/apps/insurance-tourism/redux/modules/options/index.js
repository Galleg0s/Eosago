import { FETCH_OPTIONS_SUBRISK_SUCCESS, FETCH_OPTIONS_SPORT_SUCCESS } from './constants';
import { FETCH_CALCULATION_RESULT_SUCCESS, FETCH_CROSS_SALES_SUCCESS } from '../purchase/constants';

const initialState = {};

export default function optionsReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_CALCULATION_RESULT_SUCCESS:
		case FETCH_OPTIONS_SPORT_SUCCESS:
		case FETCH_OPTIONS_SUBRISK_SUCCESS:
		case FETCH_CROSS_SALES_SUCCESS:
			return {
				...state,
				...action.payload.entities.options,
			};
		default:
			return state;
	}
}

export * from './constants';
export * from './selectors';
export * from './actions';
