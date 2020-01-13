import { paramObjToStr } from 'helpers';
import router from 'router';

const CHECK_RESULT_INFO_URL = router.generate('bankiru_insurance_order_eosago_check_result_info');
const PURCHASE_START_URL = router.generate('bankiru_insurance_order_eosago_purchase_start');
const PAYMENT_URL = router.generate('bankiru_insurance_order_eosago_purchase');

export default class ApiClient {
	constructor() {
		if (ApiClient.instance) {
			return ApiClient.instance;
		}
		ApiClient.instance = this;
	}

	getOptions(method, cookies = false, body) {
		if (method !== 'get' && method !== 'post') {
			throw new Error('Invalid parameter method: \'post\' | \'get\' allowed');
		}
		const options = {
			method,
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest'
			},
		};
		if (cookies) {
			options.credentials = 'same-origin'
		}
		if (body) {
			options.body = JSON.stringify(body);
		}
		return options;
	}

	getUrl(url, data = {}) {
		const dataStr = paramObjToStr(data);

		return `${url}?${dataStr}`
	}

	get(url, data = {}, cookies = false) {
		return fetch(this.getUrl(url, data), this.getOptions('get', cookies))
			.then(res => res.json());
	}

	post(url, data = {}, cookies = false) {
		return fetch(url, this.getOptions('post', cookies, data))
			.then(res => res.json());
	}

	getCheckInfo(hashRef) {
		return this.get(router.generate('bankiru_insurance_eosago_check_info', { checkHashref: hashRef }));
	}

	checkProlongate(hashRef) {
		return this.get(router.generate('bankiru_insurance_prolongate_products', { hashref: hashRef }));
	}

	checkResultInfo(resultHashref) {
		return this.post(CHECK_RESULT_INFO_URL, { id: resultHashref });
	}

	checkUpdate(newHashRef, email, phone) {
		return this.post(router.generate('bankiru_insurance_eosago_check_update', { checkHashref: newHashRef }),
			{ insurant: {
				email: email,
				phone: phone
			} });
	}

	purchaseStart(checkResultId) {
		return this.post(PURCHASE_START_URL, { check_result: checkResultId });
	}

	getPaymentUrl(purchaseId) {
		return this.post(PAYMENT_URL, { id: purchaseId })
	}

	// Повторять запрос каждые interval секунд, пока удовлетворяется условие condition или количество запросов attempts меньше указанного quantity
	repeat = (methodName, condition, arg, interval = 1, quantity) => {
		const makeRequest = (successCb, failedCb, attempts = 1) => {
			this[methodName](arg)
				.then(res => {
					if (condition(res) && (!quantity || (quantity && quantity >= attempts))) {
						setTimeout(
							() => makeRequest(successCb, failedCb, quantity && attempts + 1 || 1),
							interval * 1000,
						);
					} else {
						successCb(res);
					}
				})
				.catch(e => {
					if (attempts < 3) {
						setTimeout(
							() => makeRequest(successCb, failedCb, attempts + 1),
							interval * 1000 * (attempts + 1),
						);
					} else {
						failedCb(e)
					}
				})
		};
		return new Promise((resolve, reject) => makeRequest(res => resolve(res), e => reject(e)));
	};
}
