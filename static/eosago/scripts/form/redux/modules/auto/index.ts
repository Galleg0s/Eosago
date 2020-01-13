import {AutoState} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	AutoActionTypes,
	GET_AUTO_ID_REQUEST,
	GET_AUTO_ID_SUCCESS,
	GET_AUTO_ID_FAILURE,
	GET_AUTO_DATA_REQUEST,
	GET_AUTO_DATA_FAILURE,
	GET_AUTO_DATA_SUCCESS
}
from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/auto';

const initialState: AutoState = {
	isAutoDataLoading: false,
	isIdLoading: false,
};

export default function autoCatalogReduce(state = initialState, action: AutoActionTypes) {
	switch (action.type) {
		case GET_AUTO_ID_REQUEST:
			return {
				...state,
				isIdLoading: true
			}

		case GET_AUTO_ID_SUCCESS:
			return {
				...state,
				isIdLoading: false
			}

		case GET_AUTO_ID_FAILURE:
			return {
				...state,
				isIdLoading: false
			}

		case GET_AUTO_DATA_REQUEST:
			return {
				...state,
				isAutoDataLoading: true
			}

		case GET_AUTO_DATA_SUCCESS:
			return {
				...state,
				isAutoDataLoading: false
			}

		case GET_AUTO_DATA_FAILURE:
			return {
				...state,
				isAutoDataLoading: false
			}

		default:
			return {
				...state,
			}
	}
}

export * from './actions';
export * from './constants';
export * from './selectors';
