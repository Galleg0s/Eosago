import checkHttpStatus from './checkHttpStatus';
import qs from 'query-string';

const METHODS = ['get', 'post', 'delete'];
const API_BASE_URL = '/api/v1';
const COUNTRY_LIST_URL = `${API_BASE_URL}/country/list`;
const OPTIONS_SUBRISK_LIST_URL = `${API_BASE_URL}/options/subrisk`;
const CALCULATE_POLICIES_URL = `${API_BASE_URL}/calculate`;

function formatUrl(baseUrl, path, params) {
	const adjustedPath = path[0] !== '/' ? `/${path}` : path;
	const url = params ? `${adjustedPath}?${qs.stringify(params)}` : adjustedPath;
	return `${baseUrl}${url}`;
}

export default class ApiClient {
	constructor(config = {}) {
		METHODS.map(method => {
			this[method] = (path, { data, params } = {}) => {
				const headers = new Headers();
				const { baseUrl } = config;

				headers.append('X-AUTH-TOKEN', config.partnerId);

				if (config.agentId) {
					// id агента из ЛКА
					headers.append('AGENTS-USER-ID', config.agentId);
				}

				const options = {
					headers,
					method,
				};


				if (data) {
					headers.append('Content-Type', 'application/json');
					options.body = JSON.stringify(data);
				}

				return fetch(formatUrl(baseUrl, path, params), options)
					.then(checkHttpStatus)
					.then(res => res.json());
			};
		});
	}

	fetchCountries = () => this.get(COUNTRY_LIST_URL);

	fetchOptionsSubrisk = () => this.get(OPTIONS_SUBRISK_LIST_URL);

	fetchOptionsSport = (countryId, startDate) => {
		const params = { startDate };
		return this.get(`${API_BASE_URL}/amateur_sport/country/${countryId}/list`, { params });
	};

	calculatePolicies = data => this.post(CALCULATE_POLICIES_URL, { data });

	calculateFinalResult = (resultId, data) =>
		this.post(`${API_BASE_URL}/calculate/${resultId}/final`, { data });

	calculateFinalResultRedo = (resultId, data) =>
		this.post(`${API_BASE_URL}/calculate/${resultId}/final/redo`, { data });

	fetchCalculationRequest = (requestId, exchangeLink) => {
		const params = {};
		if (exchangeLink) {
			params.exchangeLink = exchangeLink;
		}
		return this.get(`${API_BASE_URL}/calculate/${requestId}/request`, { params });
	};

	fetchCalculationResult = resultId =>
		this.get(`${API_BASE_URL}/calculate/${resultId}/result`);

	fetchFinalCalculationResult = resultId =>
		this.get(`${API_BASE_URL}/calculate/${resultId}/final/result`);

	fetchFinalCalculationInfo = resultId =>
		this.get(`${API_BASE_URL}/calculate/${resultId}/final/info`);

	fetchFinalResultPayment = (resultId) =>
		this.get(`${API_BASE_URL}/payment/${resultId}`);

	fetchPaymentInfo = (resultHash) =>
		this.get(`${API_BASE_URL}/payment/info/${resultHash}`);

	recalculateResult = (resultId, data) =>
		this.post(`${API_BASE_URL}/recalculate/${resultId}`, { data });

	fetchPaymentResult = (resultHash, status) =>
		this.get(`${API_BASE_URL}/payment/${status}/${resultHash}`);

	fetchCrossSales = resultId =>
		this.get(`${API_BASE_URL}/result/${resultId}/cross_sale/list`);

	/** type: {'add'|'remove'} */
	toggleCrossSale = (requestId, option, type) => {
		if (type !== 'add' && type !== 'remove') {
			throw 'Invalid parameter \'type\' (\'add\'|\'remove\' allowed)';
		} else {
			const data = { option, ...{crossSale: true} };
			return this.post(`${API_BASE_URL}/request/${requestId}/option/${type}`, { data });
		}
	};

	// Повторять запрос каждую секунду, пока удовлетворяется условие condition
	repeat = (condition, methodName, ...args) => {
		const makeRequest = (successCb, attempts = 1) => {
			this[methodName](args)
				.then(res => {
					if (condition(res, attempts)) {
						setTimeout(
							() => makeRequest(successCb, attempts + 1),
							1000,
						);
					} else {
						successCb(res);
					}
				});
		};
		return new Promise(resolve => makeRequest(res => resolve(res)));
	};
}
