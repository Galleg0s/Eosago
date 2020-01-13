'use strict';

import { strToHash } from 'helpers';
const AppDispatcher = require('../dispatcher/dispatcher.js');
const EventEmitter = require('events').EventEmitter;
import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';
const UserStore = require('./user-store.js');
const ValidationStore = require('./validation-store.js');
const API = require('../utils/api.js');
const Hash = require('../../../_common/utils/hash.js');
const Storage = require('temporaryStorage');
const Config = require('auto.config');
const Tracking = require('auto.tracking');
const extend = require('lodash/extend');
const cloneDeep = require('lodash/cloneDeep');
const isEmpty = require('lodash/isEmpty');

let _results = {};
let _confirmedResults = null;				// Подтвержденные результаты е-ОСАГО
let _requestError = false;
let _kbmStatus = null;
let _locked = false;
let _lockedPixel = null;
let _count = null;
let _progress = 0;
let _userData = null;
let _calculationId = null;
let calculationQ = null;
let _apiInstance = null;
let _timeoutId = null;
let _resultRepetitionCount = 0;
let _requestDelay = 0;
let _requestCount = 0;
const _requestCountMax = 36;
let _render = null;
const _storageName = 'bankiru_auto_calculation';
const _widgetId = Config.widget ? Config.widget.id : null;
const _specialId = Config.special ? Config.special.id : null;
let showOpenedResultPixel = false;
const openedResultPixel = '//bankiru.go2cloud.org/SLY7';
let saveEnabled = false;
let _revision = null;

const RATING_TOOLTIP = 'Рейтинг продукта разработан для облегчения выбора подходящего предложения. ' +
					'Формула рейтинга учитывает около 300 параметров, применяемых в договоре страхования, ' +
					'веса которых распределены в зависимости от их влияния на возможность получения и размер выплаты, скорость и удобство взаимодействия, и многое другое. ' +
					'За 10 баллов принят «идеальный» договор для страхователя.';

const GROUP_TITLES = {
	1: 'КАСКО и ОСАГО',
	2: 'Только КАСКО',
	3: 'Бумажные полисы ОСАГО',
	4: 'Другие предложения',
	5: 'Электронные полисы ОСАГО'
};

EventEmitter.prototype._maxListeners = 100;

const ResultStore = extend({}, EventEmitter.prototype, {
	getResult: function() {
		return {
			data: _userData,
			result: _results,
			error: _requestError,
			kbmStatus: _kbmStatus,
			locked: _locked,
			count: _count,
			progress: _progress,
			revision: _revision,
			confirmedResults: _confirmedResults
		};
	},

	hasCalculationId: function() {
		return _calculationId !== null;
	},

	calculate: function(id, data, render) {
		_results = {};
		_confirmedResults = null;
		_requestError = false;
		_kbmStatus = null;
		_locked = false;
		_lockedPixel = null;
		_count = null;
		_progress = 0;
		_resultRepetitionCount = 0;
		_requestDelay = 0;
		_requestCount = 0;
		_render = render;
		_revision = null;

		const _self = this;

		UserStore.setLoading(true);
		this.emitUpdate();

		calculationQ = new Promise(function(fulfill, reject) {
			if (id) {
				let storageResult = {};
				try {
					storageResult = Storage.get(_storageName);
					storageResult = JSON.parse(storageResult);
				} catch (err) {
					console.warn(err);
				}

				if (storageResult && storageResult.id === id && storageResult.status === 2) {
					_calculationId = id;

					if (storageResult.data) {
						_userData = cloneDeep(storageResult.data);
						UserStore.fillData(cloneDeep(storageResult.data));
					}

					fulfill(storageResult);
				} else {
					_self._getResult(fulfill, reject, id);
				}
			} else {
				_self._getId(data, _self._getResult.bind(_self, fulfill, reject), reject);
			}
		});

		calculationQ
			.then(function(response) {
				_self._updateData(response);
				return false;
			})
			.catch(function(response) {
				const isRequestAborted = response && response.status === 0 && response.statusText === 'abort';
				const isRequestCancelledByServerError = response && response.status !== 200;

				if (!_results.length && !isRequestAborted && !isRequestCancelledByServerError) {
					_requestError = true;
				}

				if (isRequestCancelledByServerError && _resultRepetitionCount < 2) {
					_resultRepetitionCount++;
					_self._repeatResultRequest();
				}

				return isRequestCancelledByServerError;
			})
			.then(function(isLoading) {
				_self._checkRender();
				UserStore.setLoading(!!isLoading);
				_self.emitUpdate();
			});
	},

	cancelCalculation: function() {

		if (Object.keys(_results).length) { // Закрытие попапа в момент, когда результаты уже получены
			return;
		}

		this._checkRender();
		UserStore.setLoading(false);

		calculationQ = null;

		if (_timeoutId) {
			clearTimeout(_timeoutId);
			_timeoutId = null;
		}

		if (_apiInstance) {
			_apiInstance.abort();
			_apiInstance = null;
		}

		_resultRepetitionCount = 0;
		_userData = {};
		_results = {};
		_requestError = false;
		this.emitUpdate();
	},

	getLockedPixel: function() {
		return _lockedPixel;
	},

	getHasOffersLockedPixel: function() {
		const baseUrl = '//bankiru.go2cloud.org/aff_c?offer_id=1573';
		const customTrackingParams = {
			aff_sub2: _userData.region_registration.title,
			aff_sub4: ['kasko', 'osago'].filter(function(type) {return _userData.insurance_types[type];}).join(''),
			aff_sub5: _calculationId
		};
		const urlTrackingParams = Object.assign({}, Tracking, customTrackingParams);
		const source = UserStore.getRawCookiesField('HO_SOURCE');
		urlTrackingParams.source = source ? source : null;
		const paramString = Object.keys(urlTrackingParams).filter(function(key) {
			return urlTrackingParams[key] !== null;
		}).map(function(key) {
			return [key, encodeURIComponent(urlTrackingParams[key])].join('=');
		}).join('&');

		return baseUrl + '&' + paramString;
	},

	setOpenedResultPixelVisibility: function(value) {
		showOpenedResultPixel = value;
	},

	getOpenedResultPixel: function() {
		return showOpenedResultPixel ? openedResultPixel : null;
	},

	getSaveEnabled: function() {
		return saveEnabled;
	},

	toggleSaveEnabled: function() {
		saveEnabled = !saveEnabled;
	},

	getWidgetId: function() {
		return _widgetId;
	},

	getSpecial: function() {
		return Config.special || null;
	},

	_getId: function(data, fulfill, reject) {
		_apiInstance = API.getCalculationId(data, fulfill, reject);
	},

	_getResult: function(fulfill, reject, id) {
		const _self = this;

		if (!_calculationId && id) {
			_calculationId = id;
			Hash.set(id);

			_self.postMessage({
				type: 'app',
				param: 'hash',
				value: id
			});
		}

		_timeoutId = setTimeout(function() {
			_apiInstance = API.getCalculationResult(_calculationId, _self._checkResponse.bind(_self, fulfill, reject), reject);
		}, _requestDelay);
	},

	_repeatResultRequest: function() {
		const _self = this;

		function always(isLoading) {
			_self._checkRender();
			UserStore.setLoading(!!isLoading);
			_self.emitUpdate();
		}

		UserStore.setLoading(true);

		this._getResult(function(response) {
			_self._updateData(response);
			always();
		}, function(response) {
			const isRequestAborted = response && response.status === 0 && response.statusText === 'abort';
			const isRequestCancelledByTimeout = response && response.status !== 200;

			if (!_results.length && !isRequestAborted && !isRequestCancelledByTimeout) {
				_requestError = true;
			}

			if (isRequestCancelledByTimeout) {
				if (_resultRepetitionCount < 2) {
					_resultRepetitionCount++;
					_self._repeatResultRequest();
				} else {
					_requestError = true;
				}
			}

			always(isRequestCancelledByTimeout);
		}, _calculationId);
	},

	_checkResponse: function(fulfill, reject, response) {
		_requestCount++;

		if (!_requestDelay) {
			_requestDelay = 5000;
		}

		// запоняем форму данными
		if (isEmpty(_userData) && response.data) {
			_userData = cloneDeep(response.data);
			UserStore.fillData(cloneDeep(response.data));
			this._checkRender();
		}

		// если расчет устарел, производим новый
		if (!response.actual && response.data) {
			this.calculate(null, response.data);
			return;
		}

		// обработка успешного расчета
		if (response.success && response.status && response.result) {
			if (this.getSaveEnabled()) {
				this._putToStorage(response);
			}

			if (response.status === 2) {
				fulfill(response);
				return;
			} else {
				this._showResults(response);
			}
		}

		// превышено максимальное количество запросов, расчет завершился неудачей или результат пуст
		if ((_requestCount > _requestCountMax) || !response.success || response.status === 2 && !response.result) {
			reject('Ошибка получения результатов расчета');
			return;
		}

		this._getResult(fulfill, reject, _calculationId);
	},

	_updateData: function(response) {
		_results = response.result;
		_kbmStatus = response.kbmStatus;
		_locked = response.locked;
		_lockedPixel = response.locked_pixel;
		_count = {
			offers: response.count_offers,
			companies: response.count_companies
		};
		_progress = response.progress;
		_revision = response.revision;
	},

	_showResults: function(response) {
		this._updateData(response);
		this._checkRender();
		this.emitUpdate();
	},

	_checkRender: function() {
		if (_render) {
			_render();
			_render = null;
		}
	},

	clearConfirmedResults: function() {
		_confirmedResults = null;
		eventEmitter.emit('insurance:e-osago-cancel-result');
		this.emitUpdate();
	},

	getResultFromStorage: function() {
		return JSON.parse(Storage.get(_storageName));
	},

	hasResultInStorage: function() {
		const calculationData = this.getResultFromStorage();

		return !!(calculationData && calculationData.id);
	},

	loadLastResult: function() {
		const calculationData = this.getResultFromStorage();

		this.calculate(calculationData.id, null, function() {
			Hash.set(calculationData.id);
		});
	},

	_putToStorage: function(response) {
		try {
			Storage.set(_storageName, JSON.stringify({
				id: _calculationId,
				status: response.status,
				kbmStatus: response.kbmStatus,
				locked: response.locked,
				locked_pixel: response.locked_pixel,
				count_offers: response.count_offers,
				count_companies: response.count_companies,
				progress: response.progress,
				data: cloneDeep(_userData),
				result: cloneDeep(response.result),
				revision: response.revision
			}));
		} catch (err) {
			console.warn(err);
		}
	},

	_clearStorage: function() {
		try {
			Storage.remove(_storageName);
		} catch (err) {
			console.warn(err);
		}
	},

	getRatingTooltipContent: function() {
		return RATING_TOOLTIP;
	},

	getGroups: function() {
		let current = null;

		if (_userData.insurance_types.kasko) {
			if (_userData.insurance_types.osago) {
				current = 1;
			} else {
				current = 2;
			}
		} else {
			current = 3;
		}

		return {
			titles: GROUP_TITLES,
			current: current
		};
	},

	_submitUserData: function(name, phone, email, subscribe, successCallback, errorCallback) {
		API.submitUserData(_calculationId, name, phone, email, subscribe, successCallback, errorCallback);
	},

	_submitVerificationCode: function(code, successCallback, errorCallback) {
		API.submitVerificationCode(_calculationId, code, successCallback, errorCallback);
	},

	registerLeadVisit: function(company) {
		API.registerLeadVisit(_calculationId, company);
	},

	registerCompanyVisit: function(company) {
		API.registerCompanyVisit(_calculationId, company);
	},

	postMessage: function(data) {
		if (window.parent !== window.self) {
			window.parent.postMessage(JSON.stringify(data), '*');
		}
	},

	// update event
	emitUpdate: function() {
		this.emit('update');
	},
	addUpdateListener: function(callback) {
		this.on('update', callback);
	},
	removeUpdateListener: function(callback) {
		this.removeListener('update', callback);
	},

	// compare reset event
	emitCompareUpdate: function() {
		this.emit('compare');
	},
	addCompareUpdateListener: function(callback) {
		this.on('compare', callback);
	},
	removeCompareUpdateListener: function(callback) {
		this.removeListener('compare', callback);
	},

	// lead button click
	emitLeadClick: function(data) {
		this.emit('leadClick', data);
	},
	addLeadClickListener: function(callback) {
		this.on('leadClick', callback);
	},
	removeLeadClickListener: function(callback) {
		this.removeListener('leadClick', callback);
	},

	_always: function always(isLoading) {
		this._checkRender();
		UserStore.setLoading(!!isLoading);
		this.emitUpdate();
	}
});

eventEmitter.addListener('insurance:e-osago-update-auto-results', () => {
	AppDispatcher.dispatch({
		action: 'UPDATE_RESULTS'
	});
});

eventEmitter.addListener('insurance:e-osago-set-confirmed-results', (data) => {
	_confirmedResults = cloneDeep(data);
	ResultStore.emitUpdate();
});

AppDispatcher.register(function(event) {
	switch (event.action) {
		case 'CANCEL':
			ResultStore.cancelCalculation();
			break;

		case 'TOGGLE_SAVE_ENABLED':
			ResultStore.toggleSaveEnabled();
			ResultStore.emitUpdate();
			break;

		case 'SUBMIT':
			const data = UserStore.getData();
			const formFields = ValidationStore.getFields(data);

			_calculationId = null;
			_userData = {};
			_userData.insurance_types = data.type;
			_userData.widget = _widgetId;
			_userData.special = _specialId;
			_userData.revision = _revision;

			formFields.fields.forEach(function(field) {
				switch (field) {
					case 'car':
						_userData[field] = {};

						data[field].forEach(function(prop) {
							const code = prop.code === 'modification' ? 'real_modification' : prop.code;
							_userData[field][code] = {id: prop.id, value: prop.value};
						});
						break;

					case 'price':
						_userData[field] = data[field];
						_userData.cost_min = data.cost_min;
						_userData.cost_max = data.cost_max;
						break;

					default:
						_userData[field] = data[field];
						break;
				}
			});

			if (formFields.driver.length) {
				_userData.drivers = [];

				data.drivers.slice(0, data.multidrive ? 1 : data.drivers.length).forEach(function(driver) {
					const driverData = {};

					formFields.driver.forEach(function(field) {
						// todo: remove this fix after changing all date values
						if (field === 'birthday' || field === 'issue_date') {
							driverData[field] = driver[field].slice(0, 10).split('-').map(function(item) {
								return parseInt(item);
							});
						} else {
							driverData[field] = driver[field];
						}
					});

					_userData.drivers.push(driverData);
				});
			}

			_userData.request_guid = `${strToHash(JSON.stringify(_userData))}-${(~~(Math.random() * 1e8)).toString(16)}`;

			ResultStore.setOpenedResultPixelVisibility(false);
			ResultStore.calculate(null, _userData);
			break;

		case 'UPDATE_RESULTS':
			UserStore.setLoading(true);
			ResultStore._getResult(function(response) {
				ResultStore._updateData(response);
				UserStore.fillData(cloneDeep(response.data));
				_userData = cloneDeep(response.data);
				ResultStore._always();
			}, function(response) {
				const isRequestAborted = response && response.status === 0 && response.statusText === 'abort';
				const isRequestCancelledByTimeout = response && response.status !== 200;

				if (!_results.length && !isRequestAborted && !isRequestCancelledByTimeout) {
					_requestError = true;
				}

				if (isRequestCancelledByTimeout) {
					if (_resultRepetitionCount < 2) {
						_resultRepetitionCount++;
						ResultStore._repeatResultRequest();
					} else {
						_requestError = true;
					}
				}
				ResultStore._always(isRequestCancelledByTimeout);
			}, _calculationId);

			break;

		case 'COMPARE_RESET':
			ResultStore.emitCompareUpdate();
			break;

		case 'LEAD_CLICK':
			ResultStore.emitLeadClick(event.data);
			break;
	}
});

module.exports = ResultStore;
