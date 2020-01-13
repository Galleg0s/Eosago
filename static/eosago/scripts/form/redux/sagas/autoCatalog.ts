import {call, getContext, put, takeLatest} from 'redux-saga/effects';
import ApiClient from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/api';
import {
	AutoFormFieldNames,
	ChangeAction,
	FormInitializeAction,
	GetBrandsResponse,
	GetModelsResponse
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	GET_BRANDS_REQUEST, GET_MODELS_REQUEST,
	getBrandsFailure, getBrandsRequest,
	getBrandsSuccess, getModelsFailure, getModelsRequest, GetModelsRequestAction, getModelsSuccess
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/autoCatalog';
import {
	CHANGE,
	INITIALIZE,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';

function* handleGetBrandsRequest() {
	try {
		const api: ApiClient = yield getContext('api');
		const response: GetBrandsResponse = yield call(api.getBrands);
		const {
			data: {
				brands,
			}
		} = response;
		yield put(getBrandsSuccess(brands));
	} catch (e) {
		yield put(getBrandsFailure(e));
		console.error(e);
	}
}

function* handleGetModelsRequest(action: GetModelsRequestAction) {
	try {
		const api: ApiClient = yield getContext('api');
		const response: GetModelsResponse = yield call(api.getModelsByBrandId, action.payload);
		const {
			data: {
				models,
			}
		} = response;
		yield put(getModelsSuccess(models));
	} catch (e) {
		yield put(getModelsFailure(e));
		console.error(e);
	}
}

function* handleFormInitialize(action: FormInitializeAction) {
	if (action.meta.form === OSAGO_FORM_NAME) {
		yield put(getBrandsRequest());
	}
}

function* formChangeHandler({meta: { form, field }, payload}: ChangeAction) { // TODO объенитить с функцией в phoneVerification.js
	if (form === OSAGO_FORM_NAME) {
		if (field === AutoFormFieldNames.brand) {
			yield put(getModelsRequest(<number>payload))
		}
	}
}

export default function* autoCatlogSaga() {
	yield takeLatest(INITIALIZE, handleFormInitialize);
	yield takeLatest(CHANGE, formChangeHandler);
	yield takeLatest(GET_BRANDS_REQUEST, handleGetBrandsRequest);
	yield takeLatest(GET_MODELS_REQUEST, handleGetModelsRequest);
}
