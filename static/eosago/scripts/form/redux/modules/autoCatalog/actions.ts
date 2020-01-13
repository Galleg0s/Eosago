import {
	GET_BRANDS_FAILURE,
	GET_BRANDS_REQUEST,
	GET_BRANDS_SUCCESS, GET_MODELS_FAILURE, GET_MODELS_REQUEST, GET_MODELS_SUCCESS
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/autoCatalog/constants';
import {BrandEntity, ModelEntity} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export interface GetBrandsRequestAction {
	type: GET_BRANDS_REQUEST,
}
export function getBrandsRequest(): GetBrandsRequestAction {
	return {
		type: GET_BRANDS_REQUEST,
	};
}

export interface GetBrandsSuccessAction {
	type: GET_BRANDS_SUCCESS,
	payload: {
		brands: Array<BrandEntity>
	}
}
export function getBrandsSuccess(brands: Array<BrandEntity>): GetBrandsSuccessAction {
	return {
		type: GET_BRANDS_SUCCESS,
		payload: {
			brands
		},
	};
}

export interface GetBrandsFailureAction {
	type: GET_BRANDS_FAILURE,
	payload: Error,
}
export function getBrandsFailure(e: Error): GetBrandsFailureAction {
	return {
		type: GET_BRANDS_FAILURE,
		payload: e,
	};
}

export interface GetModelsRequestAction {
	type: GET_MODELS_REQUEST,
	payload: number
}
export function getModelsRequest(payload: number): GetModelsRequestAction {
	return {
		type: GET_MODELS_REQUEST,
		payload,
	};
}

export interface GetModelsSuccessAction {
	type: GET_MODELS_SUCCESS,
	payload: {
		models: Array<ModelEntity>
	}
}
export function getModelsSuccess(models: Array<ModelEntity>): GetModelsSuccessAction {
	return {
		type: GET_MODELS_SUCCESS,
		payload: {
			models,
		},
	};
}

export interface GetModelsFailureAction {
	type: GET_MODELS_FAILURE,
	payload: Error,
}
export function getModelsFailure(e: Error): GetModelsFailureAction {
	return {
		type: GET_MODELS_FAILURE,
		payload: e,
	};
}

export type AutoCatalogActionTypes =
	GetBrandsSuccessAction |
	GetBrandsRequestAction |
	GetBrandsFailureAction |
	GetModelsRequestAction |
	GetModelsSuccessAction |
	GetModelsFailureAction;
