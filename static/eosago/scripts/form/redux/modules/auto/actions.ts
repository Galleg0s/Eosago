import {
	GET_AUTO_ID_REQUEST,
	GET_AUTO_ID_SUCCESS,
	GET_AUTO_ID_FAILURE,
	GET_AUTO_DATA_REQUEST,
	GET_AUTO_DATA_FAILURE,
	GET_AUTO_DATA_SUCCESS
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/auto/constants';

export interface GetAutoIdRequest {
	type: GET_AUTO_ID_REQUEST,
	payload: string
}

export function getAutoIdRequest(value: string): GetAutoIdRequest {
	return {
		type: GET_AUTO_ID_REQUEST,
		payload: value
	};
}

export interface GetAutoIdSuccess {
	type: GET_AUTO_ID_SUCCESS
}

export function getAutoIdSuccess(): GetAutoIdSuccess {
	return {
		type: GET_AUTO_ID_SUCCESS
	};
}

export interface GetAutoIdFailure {
	type: GET_AUTO_ID_FAILURE,
}

export function getAutoIdFailure(): GetAutoIdFailure {
	return {
		type: GET_AUTO_ID_FAILURE
	};
}


export interface GetAutoDataRequest {
	type: GET_AUTO_DATA_REQUEST
}

export function getAutoDataRequest(): GetAutoDataRequest {
	return {
		type: GET_AUTO_DATA_REQUEST
	};
}

export interface GetAutoDataSuccess {
	type: GET_AUTO_DATA_SUCCESS
}

export function getAutoDataSuccess(): GetAutoDataSuccess {
	return {
		type: GET_AUTO_DATA_SUCCESS
	};
}

export interface GetAutoDataFailure {
	type: GET_AUTO_DATA_FAILURE
}

export function getAutoDataFailure(): GetAutoDataFailure {
	return {
		type: GET_AUTO_DATA_FAILURE
	};
}

export type AutoActionTypes =
	GetAutoIdRequest |
	GetAutoIdFailure |
	GetAutoIdSuccess |
	GetAutoDataRequest |
	GetAutoDataFailure
