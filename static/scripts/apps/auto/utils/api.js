'use strict';

var JsonRpcApi = require('JsonRpcApi');
var router = require('router');
var request = require('../../../_common/utils/request.js');
var apiBaseURL = '/api/';
var jsonRpcApiClient = new JsonRpcApi(apiBaseURL);

var ATTEMPTS_MAX = 5;

module.exports = {
	getCarBrands: function(callback) {
		const config = {
			method: 'get',
			url: router.generate('bankiru_insurance_rest_autocalc_brands'),
			data: null,
			onSuccess: callback,
			retryOnFail: true
		};

		return createRequestFn(config)();
	},

	getCarModels: function(brandId, callback) {
		const config = {
			method: 'get',
			url: router.generate('bankiru_insurance_rest_autocalc_models_by_brand', {brandId}),
			data: null,
			onSuccess: callback,
			retryOnFail: true
		};

		return createRequestFn(config, callback)();
	},

	getCarYears: function(modelId, callback) {
		const config = {
			method: 'get',
			url: router.generate('bankiru_insurance_rest_autocalc_years_by_model', {modelId}),
			data: null,
			onSuccess: callback,
			retryOnFail: true,
		};

		return createRequestFn(config)();
	},

	getCarModifications: function(modelId, year, callback) {
		const config = {
			method: 'get',
			url: router.generate('bankiru_insurance_rest_autocalc_modification_by_model_year', {modelId, year}),
			onSuccess: callback,
			retryOnFail: true
		};

		return createRequestFn(config)();
	},

	getCalculationId: function(data, fulfill, reject) {
		return request.post(router.generate('bankiru_insurance_order_autocalc_calculate'), data,
			function(response) {
				if (response.success) {
					fulfill(response.id);
				} else {
					reject();
				}
			},
			function(response) {
				reject(response);
			});
	},

	getCalculationResult: function(id, fulfill, reject) {
		return request.post(router.generate('bankiru_insurance_order_autocalc_result'), {id: id},
			function(response) {
				if (response.success) {
					fulfill(response);
				} else {
					reject();
				}
			},
			function(response) {
				reject(response);
			});
	},

	getBanks: function(callback) {
		return jsonRpcApiClient.req('bankInfo/getBankList')
			.then(callback);
	},

	getAntiTheftSystems: function(callback) {
		return request.get(router.generate('bankiru_insurance_order_anti_theft_system_reference'), null, callback);
	},

	submitUserData: function(hashRef, name, phone, email, subscribe, successCallback, errorCallback) {
		return request.get(
			router.generate('bankiru_insurance_order_autocalc_send_user_data'),
			{
				hashRef: hashRef,
				name: name,
				phone: phone,
				email: email,
				subscribe: subscribe
			},
			successCallback,
			errorCallback
		);
	},

	submitVerificationCode: function(hashRef, code, successCallback, errorCallback) {
		return request.get(router.generate('bankiru_insurance_order_autocalc_check_code'), {hashRef: hashRef, code: code}, successCallback, errorCallback);
	},

	registerLeadVisit: function(hashRef, company) {
		return request.get(router.generate('bankiru_insurance_order_autocalc_register_lead_visit'), {hashRef: hashRef, company: company});
	},

	registerCompanyVisit: function(hashRef, company) {
		return request.get(router.generate('bankiru_insurance_order_autocalc_register_company_visit'), {hashRef: hashRef, company: company});
	},

	getTips: function(regionId, insuranceTypeId, successCallback, errorCallback) {
		const route = insuranceTypeId ?
			router.generate('bankiru_insurance_order_autocalc_tips_region_type', {region_id: regionId, insurance_type: insuranceTypeId}) :
			router.generate('bankiru_insurance_order_autocalc_tips_region', {region_id: regionId});

		return request.get(route, null, successCallback, errorCallback);
	},

	getRegion: function(id, callback) {
		return jsonRpcApiClient.req('geo/regions/get', {id: id})
			.then(callback);
	}
};

function createRequestFn(config) {
	const errorCallback = config.retryOnFail ? createErrorCallback(sendRequest) : null;

	function sendRequest() {
		return request[config.method.toLowerCase()](config.url, config.data, config.onSuccess, errorCallback);
	}

	return sendRequest;
}

function createErrorCallback(retryFn) {
	let requestCount = 0;

	return function(response) {
		requestCount++;
		console.warn(response);

		if (requestCount < ATTEMPTS_MAX) {
			retryFn();
		}
	};
}
