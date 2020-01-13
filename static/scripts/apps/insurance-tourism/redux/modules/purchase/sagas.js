import {
	call,
	takeLatest,
	takeEvery,
	put,
	getContext,
	select,
} from 'redux-saga/effects';
import { change } from 'redux-form';
import { normalize } from 'normalizr';
import router from 'router';
import {
	ADD_CROSS_SALE_REQUEST,
	REMOVE_CROSS_SALE_REQUEST,
	TOGGLE_CROSS_SALE_REQUEST,
	PURCHASE_FORM_NAME,
	RECALCULATE_RESULT,
	FETCH_CROSS_SALES_REQUEST,
	PAY_ORDER_REQUEST,
	REDO_ORDER_PAYMENT_REQUEST,
} from './constants';
import {
	recalculateResult,
	recalculateResultRequest,
	recalculateResultSuccess,
	recalculateResultFailure,
	fetchCrossSales,
	fetchCrossSalesSuccess,
	fetchCrossSalesFailure,
	addCrossSaleSuccess,
	addCrossSaleFailure,
	removeCrossSaleSuccess,
	removeCrossSaleFailure,
	toggleCrossSaleSuccess,
	toggleCrossSaleFailure,
	showCrossSales,
	hideCrossSales,
	redoOrderPaymentFailure,
} from './actions';
import {
	calculationResultSchema,
	crossSaleSchema,
} from './schemas';
import {
	insuredBirthDatesSelector,
	purchaseCompanySelector,
	purchaseFormValueSelector,
	insuredListFormValueSelector,
	crossSalesSelector,
} from './selectors';
import { delay } from '../../../utils/utils';

function* pollCalculationResult(resultId) {
	const api = yield getContext('api');
	let result;
	// Повторяем запрос до тех пор, пока не приходит updated: true
	while (true) {
		result = yield call(api.fetchCalculationResult, resultId);
		if (result.payload && result.payload.updated) {
			break;
		}
		yield delay(1000);
	}
	return result;
}

function* handleRecalculateResult(action) {
	const api = yield getContext('api');
	const { resultId, refreshCrossSales } = action.payload;
	try {
		const birthDates = yield select(insuredBirthDatesSelector);
		const birthDatesFilled = !birthDates.some(item => !item);
		if (birthDatesFilled) {
			yield put(recalculateResultRequest());
			yield call(api.recalculateResult, resultId, { birthDates });
			const { payload } = yield call(pollCalculationResult, resultId);
			const normalized = yield call(normalize, payload, calculationResultSchema);
			yield put(recalculateResultSuccess(normalized));
			if (refreshCrossSales) {
				yield put(fetchCrossSales(resultId));
			}
		}
	} catch (e) {
		yield put(recalculateResultFailure(e));
	}
}

function* handleFetchCrossSales(action) {
	const api = yield getContext('api');
	const { resultId } = action.payload;
	try {
		const { payload } = yield call(api.fetchCrossSales, resultId);
		const normalized = yield call(normalize, payload, [crossSaleSchema]);
		const selectedCrossales = normalized.result
			.filter(item => item.inRequest)
			.map(item => item.option);
		// Отмечаем в форме ранее выбранные опции
		yield put(change(PURCHASE_FORM_NAME, 'crossSales', selectedCrossales));
		yield put(fetchCrossSalesSuccess(normalized));
	} catch (e) {
		yield put(fetchCrossSalesFailure(e));
	}
}

function* handleToggleCrossSale(action) {
	const api = yield getContext('api');
	const { resultId, requestId, optionId, actionType } = action.payload;

	if (actionType === 'add') {
		const crossSales = yield select(crossSalesSelector);
		const addedCrossSale = crossSales.find(i => i.option.id === optionId);
		if (addedCrossSale) {
			pushGtmEvent('VZR_SERVIS', 'click_crossale', addedCrossSale.option.name, Math.ceil(addedCrossSale.diffSum));
		}
	}
	try {
		const { payload } = yield call(
			api.toggleCrossSale,
			requestId,
			optionId,
			actionType,
		);
		yield put(toggleCrossSaleSuccess(payload));
	} catch (e) {
		yield put(toggleCrossSaleFailure(e));
	}
}

function* fetchFinalCalculationResult(resultId) {
	const api = yield getContext('api');
	// Повторяем запрос, пока не будет получен финальный результат
	while (true) {
		const { payload: { finalResult } } = yield call(
			api.fetchFinalCalculationResult,
			resultId
		);
		if (finalResult) {
			const company = yield select(purchaseCompanySelector);
			const oldSum = yield select(state => state.purchase.totalSum);
			const newSum = finalResult.totalSum;
			const needRecalculate = oldSum - 10 > newSum || oldSum + 1 < newSum;
			if (needRecalculate) {
				window.location = router.generate('bankiru_insurance_order_tourism_purchase_recalculate', {
					resultId: finalResult.id
				}, true);
			} else {
				try {
					const { payload: { formUrl } } = yield call(
						api.fetchFinalResultPayment,
						finalResult.id
					);
					if (formUrl) {
						if (ga) {
							// Отправляем ga событие при переходе на оплату
							yield call(ga, 'send', 'event', 'VZR_SERVIS', 'click_payment', company.code, newSum);
						}
						window.location = formUrl;
					}
				} catch (e) {
					window.location = router.generate(
						'bankiru_insurance_order_tourism_payment_not_available',
						{ resultId: finalResult.id },
					);
				}
			}
		}
		// Повторяем запрос с интервалом в 1 секунду
		yield delay(1000)
	}
}

function* handlePayOrder(action) {
	const { resultId, data } = action.payload;
	const api = yield getContext('api');
	try {
		// Расчет финального результата
		const { payload } = yield call(
			api.calculateFinalResult,
			resultId,
			data
		);
		// Повторяем запрос, пока не будет получен финальный результат
		yield call(fetchFinalCalculationResult, payload.id);
	} catch (e) {
		// Error handling
	}
}

function* handleRedoOrderPayment(action) {
	const {resultId, data} = action.payload;
	const api = yield getContext('api');
	try {
		// Расчет финального результата
		const { payload } = yield call(
			api.calculateFinalResultRedo,
			resultId,
			data
		);
		// Повторяем запрос, пока не будет получен финальный результат
		yield call(fetchFinalCalculationResult, payload.id);
	} catch (e) {
		yield put(redoOrderPaymentFailure(e));
	}
}

export default function* purchaseSaga() {
	yield takeLatest(RECALCULATE_RESULT, handleRecalculateResult);
	yield takeLatest(FETCH_CROSS_SALES_REQUEST, handleFetchCrossSales);
	yield takeLatest(TOGGLE_CROSS_SALE_REQUEST, handleToggleCrossSale);
	// Вызывается при нажатии на кнопку "Оплатить" в форме покупки
	yield takeLatest(PAY_ORDER_REQUEST, handlePayOrder);
	// Вызывается при нажатии на кнопку "Оплатить" при неуспешной оплате
	yield takeLatest(REDO_ORDER_PAYMENT_REQUEST, handleRedoOrderPayment);
}
