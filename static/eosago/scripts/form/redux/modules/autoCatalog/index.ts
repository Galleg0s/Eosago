import {AutoCatalogState} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {AutoCatalogActionTypes} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/autoCatalog/actions';
import {
	GET_BRANDS_FAILURE,
	GET_BRANDS_REQUEST,
	GET_BRANDS_SUCCESS, GET_MODELS_FAILURE, GET_MODELS_REQUEST, GET_MODELS_SUCCESS
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/autoCatalog/constants';


const initialState: AutoCatalogState = {
	brands: [],
	isBrandsLoading: false,
	models: [],
	isModelsLoading: false,
};

export default function autoCatalogReduce(state = initialState, action: AutoCatalogActionTypes) {
	switch (action.type) {
		case GET_BRANDS_REQUEST:
			return {
				...state,
				isBrandsLoading: true,
			};
		case GET_BRANDS_SUCCESS:
			return {
				...state,
				isBrandsLoading: false,
				brands: action.payload.brands,
			};
		case GET_BRANDS_FAILURE:
			return {
				...state,
				isBrandsLoading: false,
			};
		case GET_MODELS_REQUEST:
			return {
				...state,
				isModelsLoading: true,
			};
		case GET_MODELS_SUCCESS:
			return {
				...state,
				models: action.payload.models,
				isModelsLoading: false,
			};
		case GET_MODELS_FAILURE:
			return {
				...state,
				isModelsLoading: false,
			};
		default:
			return {
				...state,
			}
	}
}

export * from './actions';
export * from './constants';
export * from './selectors';
