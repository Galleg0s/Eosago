'use strict';

var AppDispatcher = require('../dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;
import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';
var FormStore = require('./form-store');
var DateHelpers = require('../../../_common/utils/date-helpers.js');
var Lat2Cyr = require('../../../_common/utils/lat2cyr.js');
var Helpers = require('helpers');
var Config = require('auto.config');
var cloneDeep = require('lodash/cloneDeep');
var extend = require('lodash/extend');
var forEach = require('lodash/forEach');
var find = require('lodash/find');
var isEqual = require('lodash/isEqual');
var Cookies = require('js.cookie');
var cookiePrefix = 'bankiru_insurance_auto__';
var _tempRegionFieldName = 'region';

var _driver = {
	lastname: undefined,
	firstname: undefined,
	surname: undefined,
	sex: 'm',
	marriage: true,
	children: true,
	age_tab: undefined,
	experience_tab: undefined,
	birthday: undefined,
	issue_date: undefined,
	license: {},
	passport: {}
};

var _data = {
	type: {kasko: true, osago: true},
	car: [
		{code: 'brand', id: null, title: 'Марка', value: null},
		{code: 'model', id: null, title: 'Модель', value: null},
		{code: 'year', id: null, title: 'Год выпуска', value: null},
		{code: 'modification', id: null, title: 'Модификация', value: null},
		{code: 'power', id: null, title: 'Мощность', value: null},
		{code: 'mileage', id: null, title: 'Пробег', value: null}
	],
	region: {id: null, title: undefined},
	region_registration: {id: null, title: undefined},
	regionsAreEqual: true,
	period: 8,
	franchise: 0,
	is_credit_car: false,
	credit_bank: -1,
	repair_type: 2,
	multidrive: false,
	accident_free: false,
	first_osago: false,
	diagnostic_card: true,
	price: 0,
	drivers: [cloneDeep(_driver)],
	accept_rules: true,
	cost_min: 0,
	cost_max: 0,
	parking_type: 0,
	warranty: false,
	is_custom_car: false,
	policy_start_date: null,
	car_used_since: null,
	has_anti_theft_system: false,
	anti_theft_system: -1
};

var _carCustomData = {
	brandCustom: null,
	modelCustom: null,
	yearCustom: null,
	powerCustom: null,
	modificationCustom: null,
	priceCustom: 10000,
	priceCustomMin: 10000,
	priceCustomMax: 10000000
};

var UserStore = extend({}, EventEmitter.prototype, {
	getTypes: function() {
		return _data.type;
	},

	getData: function() {
		return _data;
	},

	getCarCustomData: function() {
		_carCustomData.brandCustom = _data.car[0].value;
		_carCustomData.modelCustom = _data.car[1].value;
		_carCustomData.yearCustom = _data.car[2].value;
		_carCustomData.powerCustom = _data.car[4].value;
		_carCustomData.modificationCustom = _data.car[3].value;

		if (_data.price !== 0) {
			_carCustomData.priceCustom = _data.price;
		}

		return _carCustomData;
	},

	setCarCustomData: function(carCustomData) {
		var carData = {};
		var currentDate = new window.Date();

		if (_data.car[0].value === null) {
			carData.brand = {id: null, value: carCustomData.brandCustom};
		}

		if (_data.car[1].value === null) {
			carData.model = {id: null, value: carCustomData.modelCustom};
		}

		if (_data.car[2].value === null) {
			carData.year = {id: null, value: carCustomData.yearCustom};
		}

		if (_data.car[3].value === null) {
			carData.modification = {id: null, value: carCustomData.modificationCustom};
		}

		if (_data.car[4].value === null) {
			carData.power = {id: null, value: carCustomData.powerCustom};
		}

		this.setCarCustomCost(carCustomData.priceCustom);
		this.setWarranty(carCustomData.yearCustom);
		this.setField('car_used_since', Helpers.formatLocalDateToString(parseInt(carCustomData.yearCustom), currentDate.getMonth() + 1, currentDate.getDate()));
		this.setMileage(carCustomData.yearCustom);
		this.fillData({car: carData});
	},

	setConfigData: function() {
		var data = Config.data || {};

		if (data.type) {
			if (data.type === 'kasko') {
				_data.type.osago = false;
			}

			if (data.type === 'osago') {
				_data.type.kasko = false;
			}
		}
	},

	toggleOrderType: function(type) {
		_data.type[type] = !_data.type[type];
	},

	setCost: function(min, max) {
		_data.cost_min = Math.floor(min * 0.001) * 1000;
		_data.cost_max = Math.ceil(max * 0.001) * 1000;
		_data.price = _data.cost_min; // Math.round(((2 * _data.cost_min + _data.cost_max) / 3) * 0.001) * 1000;
	},

	setCarCustomCost: function(value) {
		var priceCustomMinCalculated = Math.floor(parseInt(value * 0.9 * 0.001)) * 1000;
		var priceCustomMaxCalculated = Math.ceil(parseInt(value * 1.1 * 0.001)) * 1000;
		var costMin = _carCustomData.priceCustomMin;
		var costMax = _carCustomData.priceCustomMax;

		if (priceCustomMinCalculated >= costMin) {
			costMin = priceCustomMinCalculated;
		}

		if (priceCustomMaxCalculated <= costMax) {
			costMax = priceCustomMaxCalculated;
		}

		_data.cost_min = costMin;
		_data.cost_max = costMax;
		_data.price = value;
	},

	setDiagnosticCard: function() {
		if (this.getDiagnosticCardCondition()) {
			_data.diagnostic_card = true;
		}
	},

	getDiagnosticCardCondition: function() {
		var currentYear = (new window.Date()).getFullYear();
		var carYear = parseInt(_data.car[1].value);

		return carYear > (currentYear - 3);
	},

	setWarranty: function(yearValue) {
		_data.warranty = (new window.Date()).getFullYear() === parseInt(yearValue, 10);

		if (_data.warranty) {
			this.setRepairType(1);
		}
	},

	setRepairType: function(value) {
		_data.repair_type = value;
	},

	setMileage: function(yearValue) {
		var mileageData = FormStore.getMileageTypes();
		var mileageId = null;
		var mileageValue = 0;
		var carData = {};

		for (var i = 0; i < mileageData.length; i++) {
			if (yearValue >= mileageData[i].range[1] && yearValue <= mileageData[i].range[0]) {
				mileageId = mileageData[i].id;
				mileageValue = mileageData[i].title;
				break;
			}
		}

		carData.mileage = {id: _data.is_custom_car ? null : mileageId, value: mileageValue};
		this.fillData({car: carData});
	},

	setField: function(fieldName, value) {
		_data[fieldName] = value;
	},

	fillData: function(data) {
		forEach(data, function(field, key) {
			switch (key) {
				case 'car':
					forEach(field, function(prop, key) {
						extend(find(_data.car, {code: key}), prop);
					});
					break;

				case 'insurance_types':
					_data.type = field;
					break;

				case 'drivers':
					forEach(field, function(prop, key) {
						if (!_data.drivers[key]) {
							_data.drivers[key] = cloneDeep(_driver);
						}

						// todo: remove this fix after changing all date values
						if (prop.birthday instanceof Array && prop.birthday.length) {
							prop.birthday = Helpers.formatLocalDateToString.apply(Helpers, prop.birthday);
						}

						// todo: remove this fix after changing all date values
						if (prop.issue_date instanceof Array && prop.issue_date.length) {
							prop.issue_date = Helpers.formatLocalDateToString.apply(Helpers, prop.issue_date);
						}

						extend(_data.drivers[key], prop);
					});
					break;

				default:
					_data[key] = field;
					break;
			}
		});

		forEach(_data.car, function(property) {
			if (property.id === null && property.value !== null) {
				_data.is_custom_car = true;
			}
		});

		this.setDiagnosticCard();
		this.setRegionsAreEqualField();
		this.emitChange();
	},

	setLoading: function(state) {
		_data.loading = state;
		this.emitChange();
	},

	setCookies: function(fieldsArray) {
		var _self = this;

		fieldsArray.forEach(function(field) {
			_self.setCookiesField(field, _data[field]);
		});

		this.emitChange();
	},

	setCookiesField: function(fieldName, data, expires) {
		Cookies.set(cookiePrefix + fieldName, JSON.stringify(data), {expires: expires || 30, path: '/'});
	},

	getCookiesField: function(fieldName) {
		var cookiesValue = Cookies.get(cookiePrefix + fieldName);

		return cookiesValue !== undefined ? JSON.parse(cookiesValue) : cookiesValue;
	},

	getRawCookiesField: function(fieldName) {
		return Cookies.get(fieldName);
	},

	checkCookiesField: function(fieldName) {
		return !!Cookies.get(cookiePrefix + fieldName);
	},

	setRegionsAreEqualField: function() {
		_data.regionsAreEqual = _data.region.id === _data.region_registration.id;
	},

	getTempRegionFieldName: function() {
		return _tempRegionFieldName;
	},

	setTempRegionFieldName: function(fieldName) {
		_tempRegionFieldName = fieldName;
	},

	setRegionData: function(region) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: _tempRegionFieldName,
			data: {id: parseInt(region.region_id), title: region.region_name}
		});
	},

	setDriverIssueDate: function(driverIndex, birthdayValue, issueDateValue) {
		var issueDateRanges = FormStore.getCalendarRanges('issue_date');
		var issueFrom = DateHelpers.convertStringToDateObject(birthdayValue);
		var isIssueDateValueInRange = DateHelpers.isValueInRange(issueDateValue, issueFrom, issueDateRanges.to);

		if (!isIssueDateValueInRange) {
			_data.drivers[driverIndex].issue_date = birthdayValue;
		}
	},

	// change event
	emitChange: function() {
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}
});

eventEmitter.addListener('insurance:e-osago-update-policy-start-date', (data) => {
	AppDispatcher.dispatch({
		action: 'UPDATE',
		field: 'policy_start_date',
		data: data
	});
});

AppDispatcher.register(function(event) {
	switch (event.action) {
		case 'TOGGLE_ORDER_TYPE':
			UserStore.toggleOrderType(event.type);

			UserStore.emitChange();
			break;

		case 'SELECT_CAR_PROPERTY':
			var property = find(_data.car, {code: event.code});
			var currentDate = new window.Date();

			property.id = event.data.id;
			property.value = event.data.title;

			if (event.code === 'year') {
				UserStore.setWarranty(event.data.title);
				UserStore.setField('car_used_since', Helpers.formatLocalDateToString(parseInt(event.data.title), currentDate.getMonth() + 1, currentDate.getDate()));
				UserStore.setDiagnosticCard();
			}

			if (event.code === 'modification') {
				var yearValue = Object.values(_data.car).find(e => e.code === 'year').value;
				UserStore.fillData({car: { power: event.data.power }});

				UserStore.setMileage(parseInt(yearValue));
			}

			UserStore.emitChange();
			break;

		case 'CLEAR_CAR_PROPERTY':
			var propertyFound = false;

			forEach(_data.car, function(property) {
				if (property.code === event.code) {
					propertyFound = true;
				}

				if (propertyFound) {
					property.id = null;
					property.value = null;
				}
			});

			forEach(_data.car, function(property) {
				if (property.id === null && property.value !== null) {
					property.id = null;
					property.value = null;
				}
			});

			_data.is_custom_car = false;
			UserStore.emitChange();
			break;

		case 'UPDATE':
			_data[event.field] = event.data;

			if (event.field === 'first_osago' && event.data) {
				_data.accident_free = false;
			}

			if (event.field === 'region' && event.data) {
				UserStore.setCookiesField(event.field, event.data);

				if (_data.regionsAreEqual) {
					_data.region_registration = event.data;
					UserStore.setCookiesField('region_registration', event.data);
				}

				UserStore.setRegionsAreEqualField();
			}

			if (event.field === 'region_registration' && event.data) {
				UserStore.setCookiesField(event.field, event.data);

				UserStore.setRegionsAreEqualField();
			}

			UserStore.emitChange();
			break;

		case 'ADD_DRIVER':
			_data.drivers.push(cloneDeep(_driver));
			UserStore.emitChange();
			break;

		case 'DELETE_DRIVER':
			_data.drivers.splice(event.index, 1);
			UserStore.emitChange();
			break;

		case 'UPDATE_DRIVER':
			var driverField = _data.drivers[event.index];
			var value = event.value;

			if (event.field && event.field[0] === 'birthday') {
				if (value && driverField.issue_date) {
					UserStore.setDriverIssueDate(event.index, value, driverField.issue_date);
				}
			}

			if (isEqual(event.field, ['license', 'series'])) {
				value = Lat2Cyr.transform(value);
			}

			forEach(event.field, function(field, index) {
				if (event.field.length === index + 1) {
					driverField[field] = value;
				} else {
					driverField = driverField[field];
				}
			});

			UserStore.emitChange();
			break;

		default:
			return true;
	}
});

module.exports = UserStore;
