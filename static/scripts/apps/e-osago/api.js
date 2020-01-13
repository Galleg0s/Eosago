import { paramObjToStr } from 'helpers';
import router from 'router';

const PAYMENT_URL = router.generate('bankiru_insurance_order_eosago_purchase');
const CHECK_CREATE_URL = router.generate('bankiru_insurance_order_eosago_check_create');
const GET_PAPER_POLICES_URL = router.generate('bankiru_insurance_order_autocalc_result');
const CHEK_RESULT_INFO_URL = router.generate('bankiru_insurance_order_eosago_check_result_info');
const PURCHASE_START_URL = router.generate('bankiru_insurance_order_eosago_purchase_start');
export const RGS_SMS_SEND_URL = router.generate('bankiru_insurance_order_eosago_rgs_sms_send');
export const RGS_SMS_VERIFY_URL = router.generate('bankiru_insurance_order_eosago_rgs_sms_verify');

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

	getPaymentUrl(purchaseId) {
		return this.post(PAYMENT_URL, { id: purchaseId })
	}

	checkCreate(dataObj) {
		return this.post(CHECK_CREATE_URL, dataObj, true);
	}

	getPaperPolices(hash) {
		return this.post(GET_PAPER_POLICES_URL, { id: hash });
	}

	checkResultInfo(resultHashref) {
		return this.post(CHEK_RESULT_INFO_URL, { id: resultHashref });
	}

	purchaseStart(checkResultId) {
		return this.post(PURCHASE_START_URL, { check_result: checkResultId });
	}

	rgsSendUrl(data) {
		return this.post(RGS_SMS_SEND_URL, { ...data })
	}

	rgsVerifyCode(code, agreementId) {
		return this.post(RGS_SMS_VERIFY_URL, { code, agreementId });
	}

	// Повторять запрос каждую секунду, пока удовлетворяется условие condition
	repeat = (methodName, condition, arg) => {
		const makeRequest = (successCb, failedCb, attempts = 1) => {
			this[methodName](arg)
				.then(res => {
					if (condition(res)) {
						setTimeout(
							() => makeRequest(successCb, failedCb),
							1000,
						);
					} else {
						successCb(res);
					}
				})
				.catch(e => {
					if (attempts < 3) {
						setTimeout(
							() => makeRequest(successCb, failedCb, attempts + 1),
							1000 * (attempts + 1),
						);
					} else {
						failedCb(e)
					}
				})
		};
		return new Promise((resolve, reject) => makeRequest(res => resolve(res), e => reject(e)));
	};
}
