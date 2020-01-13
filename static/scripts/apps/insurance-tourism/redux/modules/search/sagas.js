import {
	call,
	put,
	takeLatest,
	getContext,
	select,
} from 'redux-saga/effects';
import qs from 'query-string';
import { normalize } from 'normalizr';
import { SEARCH_POLICIES_REQUEST } from './constants';
import {
	submitUrlSelector,
	searchParametersSelector,
} from './selectors';
import {
	updateSearchParameters,
	searchPoliciesSuccess,
	searchPoliciesFailure,
	searchPoliciesUpdate,
} from './actions';
import { resultSchema } from '../results/schemas';
import { delay } from '../../../utils/utils';

function getSubmitUrlWithParams(submitUrl, params) {
	const urlParams = qs.stringify(params, { arrayFormat: 'bracket' });
	return `${submitUrl}?${urlParams}`;
}

function processFormValues({ tourists, dates, insuranceAmount, insuranceDaysCount, currency, yearPolicy, ...otherValues }) {
	const data = {
		ages: tourists.map(item => item.age),
		startDate: dates.startDate,
		endDate: dates.endDate,
		...otherValues,
	};
	if (insuranceAmount && currency) {
		data.insuranceAmount = insuranceAmount;
		data.currency = currency;
	}
	if (yearPolicy) {
		data.yearPolicy = yearPolicy;
		data.insuranceDaysCount = insuranceDaysCount;
	}
	return data;
}

function* pollCalculationResult(resultId, exchangeLink, maxAttempts = 20) {
	const api = yield getContext('api');
	const searchParameters = yield select(searchParametersSelector);
	let attempts = 0;
	let calculationResults;
	while (true) {
		const { payload } = yield call(api.fetchCalculationRequest, resultId, exchangeLink);
		const { packagesCount, packagesCountReady } = payload;
		const calculationProgress = packagesCountReady / packagesCount;
		calculationResults = payload.sortedResults;
		const firstResult = calculationResults[0] || {};
		if (searchParameters.currency !== firstResult.insuranceAmountCurrency) {
			// Как только получили первый результат, устанавливаем валюту
			yield put(updateSearchParameters({ currency: firstResult.insuranceAmountCurrency }));
		}
		// Считаем результат поиска
		const searchProgress = Math.ceil(calculationProgress * 100) || 0;
		yield put(searchPoliciesUpdate({ searchProgress }));

		attempts += 1;
		if (calculationProgress === 1 || attempts === maxAttempts) {
			break;
		}
		yield delay(1000);
	}
	return calculationResults;
}

function* searchPolicies(action) {
	const { isAjax, params } = action.payload;
	const api = yield getContext('api');
	const submitUrl = yield select(submitUrlSelector);
	const { partnerId, iframe, agentId } = yield select(state => state.runtime);
	const formData = yield call(processFormValues, params);
	const pathParams = { ...formData };
	if (partnerId) {
		pathParams.partnerId = partnerId;
	}
	if (agentId) {
		pathParams.agentId = agentId;
	}
	const newPath = yield call(getSubmitUrlWithParams, submitUrl, pathParams);
	if (!isAjax) {
		// Если iFrame виджет, то меняем location родительского окна
		if (iframe) {
			window.parent.location = newPath;
		} else {
			window.location = newPath;
		}
	} else {
		if (history && history.replaceState) {
			history.replaceState({ newPath }, '', newPath);
		}

		try {
			// yield put(updateSearchParameters(formData));
			// Задержка для debounce'а запросов
			yield delay(1000);
			const { payload } = yield call(api.calculatePolicies, formData);
			const results = yield call(pollCalculationResult, payload.id, formData.exchangeLink);
			const normalizedResults = yield call(normalize, results, [resultSchema]);
			yield put(searchPoliciesSuccess(normalizedResults));
		} catch (e) {
			// error handling
			yield put(searchPoliciesFailure(e));
		}
	}
}

export default function* searchSaga() {
	yield takeLatest(SEARCH_POLICIES_REQUEST, searchPolicies);
}
