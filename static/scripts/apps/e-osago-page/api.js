import { paramObjToStr } from 'helpers';
import router from 'router';

const GET_PAPER_POLICES_URL = router.generate('bankiru_insurance_order_autocalc_result');

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

	getPaperPolices(hash) {
		return this.post(GET_PAPER_POLICES_URL, { id: hash });
	}

	eosagoCheck(hashref) {
		return this.get(router.generate('bankiru_insurance_eosago_check_info', { checkHashref: hashref }));
	}
}
