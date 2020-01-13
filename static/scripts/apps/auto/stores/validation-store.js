'use strict';

import Pattern from '../../../_common/validation/pattern.js';
import FormStore from './form-store.js';
import UserStore from './user-store.js';
import DateHelpers from '../../../_common/utils/date-helpers';
var union = require('lodash/union');
var isUndefined = require('lodash/isUndefined');
var reduce = require('lodash/reduce');

var _fields = [];
var _fieldsValidation = {};
var _driversValidation = [];
var _hints = [];

const _getDriverFields = function(data) {
	if (data.multidrive && !data.accident_free ||
		!data.type.osago && data.multidrive && data.accident_free ||
		!data.type.kasko && !data.type.osago) {
		return [];
	}

	if (data.multidrive && data.accident_free) {
		return ['lastname', 'firstname', 'surname', 'birthday', 'passport', 'vin'];
	} else {
		if (data.accident_free && data.type.osago) {
			if (data.type.kasko) {
				return ['lastname', 'firstname', 'surname', 'birthday', 'license', 'issue_date', 'sex', 'marriage', 'children'];
			} else {
				return ['lastname', 'firstname', 'surname', 'birthday', 'license', 'issue_date'];
			}
		} else {
			if (data.type.kasko) {
				return ['age', 'marriage', 'experience', 'sex', 'children'];
			} else {
				return ['age_tab', 'experience_tab'];
			}
		}
	}
};


const _validationPatterns = {
	lastname: '/^[а-яА-ЯёЁ\s-]+$/',
	firstname: '/^[а-яА-ЯёЁ\s-]+$/',
	surname: '/^[а-яА-ЯёЁ\s-]+$/',
	birthday: [],
	license: {series: '/^[0-9]{2}[0-9а-яА-Яa-zA-Z]{2}$/', number: '/^[0-9]{6}$/'},
	issue_date: [],
	vin: '/^[0-9а-яА-Яa-zA-Z]{17}$/',
	passport: {series: '/^[0-9]{4}$/', number: '/^[0-9]{6}$/'}
};

const _fieldsValidationRules = {
	credit_bank: function(value) {
		return value !== -1;
	},
	policy_start_date: function(value) {
		const { to } = FormStore.getCalendarRanges('policy_start_date');
		const dateValue = new Date(value);
		const today = new Date();
		const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		startDate.setDate(startDate.getDate() + 1);
		return value !== null &&
			startDate.getTime() <= dateValue.getTime() &&
			dateValue.getTime() <= new Date(to.year, to.month - 1, to.day).getTime();
	},
	car_used_since: function(value) {
		const data = UserStore.getData();
		const policyStartDate = new Date(data.policy_start_date);
		const carYear = parseInt(data.car[2].value);
		const carUsedSinceDate = new Date(value);
		return value !== null &&
			carUsedSinceDate.getFullYear() >= carYear &&
			carUsedSinceDate.valueOf() <= policyStartDate.valueOf();
	},
	anti_theft_system: function(value) {
		return value !== -1;
	}
};

const _driverValidationRules = {
	lastname: function(value) {
		return Pattern.validate(value, _validationPatterns.lastname);
	},
	firstname: function(value) {
		return Pattern.validate(value, _validationPatterns.firstname);
	},
	surname: function(value) {
		return Pattern.validate(value, _validationPatterns.surname);
	},
	birthday: function(value) {
		const { from, to } = FormStore.getCalendarRanges('birthday');
		const valueDate = new Date(value).valueOf();
		return value !== null && valueDate >= new Date(from.year, from.month - 1, from.day).valueOf() &&
			valueDate <= new Date(to.year, to.month - 1, to.day).valueOf();
	},
	'license.series': function(value, index) {
		var valid = Pattern.validate(value, _validationPatterns.license.series);
		_driversValidation[index]['license.series'] = valid;
		return valid;
	},
	'license.number': function(value, index) {
		var valid = Pattern.validate(value, _validationPatterns.license.number);
		_driversValidation[index]['license.number'] = valid;
		return valid;
	},
	license: function(value, index) {
		return this['license.series'](value.series, index) && this['license.number'](value.number, index);
	},
	issue_date: function(value, index) {
		let { from, to } = FormStore.getCalendarRanges('issue_date');
		const valueDate = new Date(value).valueOf();
		const drivers = UserStore.getData().drivers;
		const currentDriver = drivers[index];
		let bDate;
		if (currentDriver.birthday) {
			bDate = new Date(currentDriver.birthday);
			bDate.setFullYear(bDate.getFullYear() + 16);
		}
		from = bDate ? DateHelpers.convertStringToDateObject(bDate) : from;
		return value !== null && valueDate >= new Date(from.year, from.month - 1, from.day).valueOf() &&
			valueDate <= new Date(to.year, to.month - 1, to.day).valueOf();
	},
	sex: function(value) {
		return !!value;
	},
	marriage: function(value) {
		return value !== undefined;
	},
	children: function(value) {
		return value !== undefined;
	},
	vin: function(value) {
		return Pattern.validate(value, _validationPatterns.vin);
	},
	'passport.series': function(value, index) {
		var valid = Pattern.validate(value, _validationPatterns.passport.series);
		_driversValidation[index]['passport.series'] = valid;
		return valid;
	},
	'passport.number': function(value, index) {
		var valid = Pattern.validate(value, _validationPatterns.passport.number);
		_driversValidation[index]['passport.number'] = valid;
		return valid;
	},
	passport: function(value, index) {
		return this['passport.series'](value.series, index) && this['passport.number'](value.number, index);
	},
	age: function(value) {
		value = parseInt(value);
		return value >= 18 && value < 90;
	},
	experience: function(value, index) {
		value = parseInt(value);
		const drivers = UserStore.getData().drivers;
		const currentDriver = drivers[index];
		return parseInt(currentDriver.age) >= 18 + value && value < 70;
	},
	age_tab: function(value) {
		value = parseInt(value);
		return value >= 18 && value < 90;
	},
	experience_tab: function(value) {
		value = parseInt(value);
		return value >= 0 && value < 90;
	}
};

const _carCustomValidationRules = {
	brandCustom: function(value) {
		return !!value && /^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(value);
	},
	modelCustom: function(value) {
		return !!value && /^[0-9а-яА-ЯёЁa-zA-Z\s-]+$/.test(value);
	},
	yearCustom: function(value) {
		const yearMinValue = 1936;
		const yearMaxValue = (new window.Date()).getFullYear();
		const valueInt = parseInt(value, 10);

		return !isNaN(valueInt) && (valueInt >= yearMinValue && valueInt <= yearMaxValue);
	},
	powerCustom: function(value) {
		const powerMinValue = 10;
		const powerMaxValue = 10000;
		const valueInt = parseInt(value, 10);

		return !isNaN(valueInt) && /^[0-9]+$/.test(value) && (valueInt >= powerMinValue && valueInt <= powerMaxValue) && value === (String(valueInt));
	},
	modificationCustom: function(value) {
		return !!value;
	}
};

const ValidationStore = {
	setField: function(fields) {
		_fields = union(_fields, fields);
	},

	getFields: function(data) {
		return {fields: _fields, driver: _getDriverFields(data)};
	},

	clearFields: function() {
		_fields = [];
	},

	getHints: function() {
		return _hints;
	},

	updateHints: function(data) {
		var fieldNames = FormStore.getFieldNames();
		var driverCount = FormStore.getDriverCount();
		var driverFields = _getDriverFields(data);

		_hints.length = 0;

		_fields.forEach(function(field) {
			if (_fieldsValidationRules.hasOwnProperty(field) && _fieldsValidation[field] === false) {
				_hints.push({
					title: fieldNames[field],
					fieldName: field
				});
			}
		});

		if (!data.accept_rules) {
			_hints.push({
				title: fieldNames.accept_rules,
				fieldName: 'accept_rules'
			});
		}

		_driversValidation.slice(0, data.multidrive ? 1 : data.drivers.length).forEach(function(driver, index) {
			if (!driver.valid) {
				driverFields.forEach(function(fieldName) {
					var subTitle = '';

					if (!driver[fieldName] && fieldName !== 'valid') {
						subTitle = data.multidrive ? 'Собственник ТС' : driverCount[index] + ' водитель';
						_hints.push({
							title: fieldNames[fieldName] + ' (' + subTitle + ')',
							fieldName: fieldName + index
						});
					}
				});
			}
		});
	},

	validateField: function(data, field) {
		if (!_fieldsValidationRules[field]) {
			return true;
		}

		_fieldsValidation[field] = _fieldsValidationRules[field](data[field]);

		return _fieldsValidation[field];
	},

	validateCarCustomField: function(fieldName, fieldValue) {
		return _carCustomValidationRules[fieldName](fieldValue);
	},

	validateDriver: function(data, index) {
		var driverFields = _getDriverFields(data);
		var driverData = data.drivers[index];
		var driverValid = true;

		if (!_driversValidation[index]) {
			_driversValidation[index] = {};
		}

		driverFields.forEach(function(field) {
			var value = driverData[field];
			var fieldValid = _driverValidationRules[field](value, index);

			if (!fieldValid) {
				driverValid = false;
			}

			_driversValidation[index][field] = fieldValid;
		});

		_driversValidation[index].valid = driverValid;

		return _driversValidation[index];
	},

	validateForm: function(data) {
		var valid = true;
		var driverFields = _getDriverFields(data);

		_driversValidation = _driversValidation.slice(0, data.multidrive ? 1 : data.drivers.length);

		if (driverFields.length) {
			_driversValidation.forEach(function(driver) {
				if (!driver.valid) {
					valid = false;
				}
			});
		}

		_fields.forEach(function(field) {
			if (!isUndefined(_fieldsValidation[field]) && !_fieldsValidation[field]) {
				valid = false;
			}
		});

		this.updateHints(data);

		return valid && data.accept_rules;
	},

	validateCarCustomForm: function(data) {
		return reduce(Object.keys(_carCustomValidationRules), function(result, field) {
			return result && _carCustomValidationRules[field](data[field]);
		}, true);
	}
};

module.exports = ValidationStore;
