import qs from 'query-string';

export const enum APIPaths {
	requestVerificationCode = '/insurance/api/eosago/phone-verification/check',
	sendVerificationCode = '/insurance/api/eosago/phone-verification/verify',
	getBrands = '/api/v1/auto/brands',
	getModels = '/api/v1/auto/models',
	getAutoId = '/api/v1/avtocod/inquiries',
	getPaymentUrl = '/insurance/order/eosago/payment_url/',
	startPurchase = '/insurance/order/eosago/purchase_start/',
	checkCreate = '/insurance/order/eosago/check_create/',
	checkResultInfo = '/insurance/order/eosago/check_result_info/',
	getPassportBranch = '/bigdata/get-passport-branch',
}

interface IAPIPathsComputable {
	getAutoData: (value: any) => string;
}

const APIPathsComputable: IAPIPathsComputable = {
	getAutoData: (value: string) => `${APIPaths.getAutoId}/${value}`
}

const enum RequestTypes {
	get = 'GET',
	post = 'POST',
}

interface RequestData {
	data?: {},
	params?: {}
}

interface RequestOprions {
	headers: Headers,
	method: string,
	body?: string,
}

function formatUrl(path: string, params?: {}) {
	const adjustedPath = path[0] !== '/' ? `/${ path }` : path;
	return params ? `${ adjustedPath }?${ qs.stringify(params) }` : adjustedPath;
}

function checkHttpStatus(response: Response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	throw new Error(response.statusText);
}

export interface ApiClientConfig {
	busUrl: string,
}

class ApiClient {
	static instance: ApiClient;
	private busUrl: string;

	constructor(config: ApiClientConfig) {
		if (ApiClient.instance) {
			return ApiClient.instance;
		}
		this.busUrl = config.busUrl;
		ApiClient.instance = this;
	}

	private makeRequest = (path: APIPaths | string, method: RequestTypes, {data, params}: RequestData, isBusUrl: boolean) => {
		const headers = new Headers();
		headers.append('Content-type', 'application/json; charset=UTF-8');
		headers.append('X-Requested-With', 'XMLHttpRequest');
		const options: RequestOprions = {
			headers,
			method,
		};

		if (data) {
			options.body = JSON.stringify(data);
		}

		const url = isBusUrl ? `${this.busUrl}${formatUrl(path, params)}` : `${formatUrl(path, params)}`;

		return fetch(url, options)
			.then(checkHttpStatus)
			.then(res => res.json())
	};

	private get = (path: APIPaths | string, params?: {}, isBusUrl = false) =>
		this.makeRequest(path, RequestTypes.get, {params}, isBusUrl);

	private post = (path: APIPaths, data?: {}, isBusUrl = false) =>
		this.makeRequest(path, RequestTypes.post, {data}, isBusUrl);

	// @todo fix any
	public repeat = (methodName, condition, arg, delay = 5, limit = 5, minAttempts = 3) => {
		const makeRequest = (successCb, failedCb, attempts = 1) => {
			this[methodName](arg)
				.then(result => {
					if (condition(result) && (!limit || (limit && limit >= attempts))) {
						setTimeout(
							() => makeRequest(successCb, failedCb, limit && attempts + 1 || 1),
							delay * 1000,
						);
					} else {
						successCb(result);
					}
				})
				.catch(error => {
					if (attempts < minAttempts) {
						setTimeout(
							() => makeRequest(successCb, failedCb, attempts + 1),
							delay * 1000 * (attempts + 1),
						);
					} else {
						failedCb(error);
					}
				})
		};
		return new Promise((resolve, reject) => makeRequest(res => resolve(res), e => reject(e)));
	};

	/** Методы */

	/** Отправка запроса на получение кода на телефон */
	public requestVerificationCode = (phone: string) => this.get(APIPaths.requestVerificationCode, {phone});

	/** Отправка полученного на телефон кода */
	public sendVerificationCode = (code: string) => this.get(APIPaths.sendVerificationCode, {code});

	/**
	 * Получение списка брендов из автокаталога
	 * https://wiki.banki.ru/pages/viewpage.action?pageId=71504907
	 */
	public getBrands = () => this.get(APIPaths.getBrands, undefined, true);

	/**
	 * Получение списка моделей по id бренда
	 * https://wiki.banki.ru/pages/viewpage.action?pageId=71504927
	 */
	public getModelsByBrandId = (brandId: number) => this.get(APIPaths.getModels, { brandIds: [brandId] }, true);

	public checkCreate = (data: any) => this.post(APIPaths.checkCreate, data);

	public getPassportBranch = (emitentCode: string) => this.post(APIPaths.getPassportBranch, { data: { branchCode: emitentCode }});

	public getResultInfo = (id: number) => this.post(APIPaths.checkResultInfo, {id});

	/**
	 * Получение id автомобиля по номеру
	 */
	public getAutoId = (carNumber: string) => {
		const data = {
			data: {
				inquiry: {
					id: carNumber,
					idType: 'GRZ'
				}
			}
		}

		return this.post(APIPaths.getAutoId, data, true)
	};

	/**
	 * Получение данных автомобиля по id
	 */
	public getAutoData = (id: string) => {
		return this.get(APIPathsComputable.getAutoData(id), undefined, true)
	};

	/** Получение платёжной ссылки */
	public getPaymentUrl = (policyId: number) => this.post(APIPaths.getPaymentUrl, { id: policyId });

	/** Начало покупки */
	public startPurchase = (check_result: number) => this.post(APIPaths.startPurchase, { check_result: check_result });
}

export default ApiClient;
