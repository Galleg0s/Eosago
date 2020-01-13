import {call, getContext, put, takeLatest, select} from 'redux-saga/effects';
import { change } from 'redux-form'
import ApiClient from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/api';
import {
	GetAutoIdResponse, GetAutoDataResponse,
	AutoFormFieldNames, AutoIdentifierFieldNames, DiagnosticCardFieldNames, AutoDocumentsFiledNames,
	State,
	BrandEntity, ModelEntity
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	GET_AUTO_ID_REQUEST, GetAutoIdRequest,
	GET_AUTO_ID_FAILURE, getAutoIdFailure,
	GET_AUTO_ID_SUCCESS, getAutoIdSuccess,
	GET_AUTO_DATA_REQUEST, getAutoDataRequest, GetAutoDataRequest,
	getAutoDataFailure,
	getAutoDataSuccess,
	GET_AUTO_DATA_DELAY, GET_AUTO_DATA_LIMIT,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/auto';
import {
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {
	brandsSelector,
	modelsSelector,
	GET_MODELS_SUCCESS,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/autoCatalog';

let modelNameToBeMapped: string | null = null;
let modelIdToBeMapped: number | null = null;

const LADA_NAME_AVTOCOD = 'LADA (ВАЗ)';
const LADA_NAME_DICTIONARY = 'ВАЗ (Lada)';

function findBrandInDictionary(name: string, dictionary: Array<BrandEntity>): BrandEntity | undefined {
	const brandNameLowerCase = name.toLocaleLowerCase();
	const brandFromDictionary = dictionary.find(brand =>
		brand.name.toLowerCase() === brandNameLowerCase ||
		brand.nameRu.toLowerCase() === brandNameLowerCase ||
		(name === LADA_NAME_AVTOCOD && brand.name === LADA_NAME_DICTIONARY)
	)
	return brandFromDictionary;
}

function findModelInDictionary(name: string, dictionary: Array<ModelEntity>): ModelEntity | undefined {
	const modelNameLowerCase = name.toLowerCase();
	const modelFromDictionary = dictionary.find(_model =>
		_model.name.toLowerCase() === modelNameLowerCase ||
		_model.nameRu.toLowerCase() === modelNameLowerCase);
	return modelFromDictionary;
}

function* handleGetAutoIdRequest(action: GetAutoIdRequest) {
	try {
		const carNumber = action.payload;
		const api: ApiClient = yield getContext('api');
		const { data, result }: GetAutoIdResponse = yield call(api.getAutoId, carNumber);
		if (result.status !== 'success' || !data) {
			yield put(getAutoIdFailure());
			return;
		}

		yield getAutoData(data.inquiryId);
		yield put(getAutoIdSuccess());
	} catch (e) {
		yield put(getAutoIdFailure());
		console.error(e);
	}
}

function* getAutoData(id: string) {
	const api: ApiClient = yield getContext('api');
	yield put(getAutoDataRequest());
	const response: GetAutoDataResponse = yield call(() =>
		api.repeat(
			'getAutoData',
			(response: GetAutoDataResponse) => {
				const { status } = response.result;
				if (status === 'Failed') {
					throw new Error(`${response.result.errors ? response.result.errors.map(error => error.message).join(', ') : 'Не удалось получить данные об автомобиле.'}`);
				}

				return status !== 'Ready';
			},
			id,
			GET_AUTO_DATA_DELAY,
			GET_AUTO_DATA_LIMIT,
			1
		)
		.then(result => result)
		.catch(error => {
			return {
				error: error,
			};
		})
	);

	if (response.error || !response.data) {
		yield put(getAutoDataFailure());
		return;
	}

	const { data: { vehicle, regData, diagnosticCard } } = response;
	const valuesObj: {[key: string]: any} = {};
	if (vehicle) {
		if (vehicle.vehicleSpecs) {
			valuesObj[AutoFormFieldNames.year] = vehicle.vehicleSpecs.issueYear;
			valuesObj[AutoFormFieldNames.power] = vehicle.vehicleSpecs.enginePowerHp && Math.ceil(vehicle.vehicleSpecs.enginePowerHp)
		}

		let resultBrandId;
		let brandFromDictionary;

		const brandName = (vehicle.brand && (vehicle.brand.brandNameDict || vehicle.brand.brandName)) ||
						(vehicle.vehicleSpecs && (vehicle.vehicleSpecs.brandName));

		const brandId = vehicle.brand && vehicle.brand.id;

		const modelName = (vehicle.brand && vehicle.brand.model && (vehicle.brand.model.modelNameDict || vehicle.brand.model.modelName)) ||
						(vehicle.vehicleSpecs && vehicle.vehicleSpecs.modelName);

		const modelId = vehicle.brand && vehicle.brand.model && vehicle.brand.model.id;

		const state: State = yield(select());
		const brands = brandsSelector(state);

		if (brands.length) {
			if (brandId) {
				brandFromDictionary = brands.find(brand => brand.id === brandId);
				if (brandFromDictionary) {
					resultBrandId = brandId;
				} else if (brandName) {
					brandFromDictionary = findBrandInDictionary(brandName, brands);
					if (brandFromDictionary) {
						resultBrandId = brandFromDictionary.id;
					}
				}
			} else if (brandName) {
				brandFromDictionary = findBrandInDictionary(brandName, brands);
				if (brandFromDictionary) {
					resultBrandId = brandFromDictionary.id;
				}
			}
		} else if (brandId) {
			resultBrandId = brandId;
		}

		valuesObj[AutoFormFieldNames.brand] = resultBrandId;

		modelIdToBeMapped = modelId || null;
		modelNameToBeMapped = modelName || null;
	}

	if (regData) {
		valuesObj[AutoIdentifierFieldNames.vinNumber] = regData.vin;
		valuesObj[AutoDocumentsFiledNames.seriesNumber] = regData.regNumber ? regData.sts : regData.pts
		valuesObj[AutoIdentifierFieldNames.licensePlate] = regData.regNumber;
		valuesObj[AutoIdentifierFieldNames.bodyNumber] = regData.body;
	}

	for (const valuesObjKey in valuesObj) {
		yield put(change(OSAGO_FORM_NAME, valuesObjKey, valuesObj[valuesObjKey]));
	}

	yield put(getAutoDataSuccess());
}

function* handleGetModelsSuccess() {
	// если ранее мы нашли марку авто, то сохранили название модели.
	// мы не могли сразу найти модель, поскольку словарь моделей подтянется только после того, как мы прокинем марку
	// здесь мы отлавливаем получение словаря моделей и ищем в нём модель по сохранённому названию
	if (!modelNameToBeMapped && !modelIdToBeMapped) {
		return;
	}
	const state: State = yield(select());
	const models = modelsSelector(state);
	let modelFromDictionary;
	if (models && models.length) {
		if (modelIdToBeMapped) {
			modelFromDictionary = models.find(model => model.id === modelIdToBeMapped);
			if (modelFromDictionary) {
				yield put(change(OSAGO_FORM_NAME, AutoFormFieldNames.model, modelFromDictionary.id));
			} else if (modelNameToBeMapped) {
				modelFromDictionary = findModelInDictionary(modelNameToBeMapped, models);
				if (modelFromDictionary) {
					yield put(change(OSAGO_FORM_NAME, AutoFormFieldNames.model, modelFromDictionary.id));
				}
			}
		} else if (modelNameToBeMapped) {
			modelFromDictionary = findModelInDictionary(modelNameToBeMapped, models);
			if (modelFromDictionary) {
				yield put(change(OSAGO_FORM_NAME, AutoFormFieldNames.model, modelFromDictionary.id));
			}
		}
	}

	modelNameToBeMapped = null;
	modelIdToBeMapped = null;
}


export default function* autoCatlogSaga() {
	yield takeLatest(GET_AUTO_ID_REQUEST, handleGetAutoIdRequest);
	yield takeLatest(GET_MODELS_SUCCESS, handleGetModelsSuccess);
}
