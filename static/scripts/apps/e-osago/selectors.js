import { Steps, multidriveItems, usagePeriodsList, constraints } from './data.js';
import validate from 'validate';
import { CAR_IDENTIFIERS } from './constants';
import { now } from './data';

validate.validators.presence.options = {message: '^Необходимо заполнить поле'};
validate.validators.checkbox = function(value, options, key, attributes) {
	return value !== options.checked ? options.message : null;
};

export function prepareStepItems(formValidity, fkey) {
	const StepsArray = [];

	Steps.slice().forEach((item, index) => {
		let currentItem = {...item};

		currentItem.success = StepsArray.every((Step) => Step.success === true) && formValidity[currentItem[fkey]] === true;

		StepsArray.push(currentItem);
	});

	return StepsArray;
}

export function getStepsCount() {
	return Steps.length;
}

export function getMultidriveItems() {
	return multidriveItems;
}

export function getUsagePeriodsList() {
	return usagePeriodsList;
}

export function getInsurantState(state) {
	return state.insurant;
}

export function getOwnerState(state) {
	return state.owner;
}

export function isFormValid(validity) {
	return Object.keys(validity).reduce((result, itemKey) => {
		return result && validity[itemKey];
	}, true);
}

export function getFormValidationResult(state, formKey) {

	if (formKey === 'insurant') {
		constraints[formKey].smscode.presence = state.form.ownerIsAnInsurant && !state.form.isPhoneVerified === true;
	}

	if (formKey === 'car') {
		if (state.car.year) {
			constraints[formKey].registration_passport_date.numericality.greaterThanOrEqualTo = new Date(state.car.year, 0, 1).valueOf();
		}
		CAR_IDENTIFIERS.map(item => {
			constraints[formKey][item.id].presence = state.car.identifier === item.id;
		});
		if (state.car.diagnostic_card && state.car.diagnostic_card.length) {
			constraints[formKey].diagnostic_card_date_end = {
				presence: true,
				numericality: {
					onlyInteger: true,
					strict: true,
					greaterThanOrEqualTo: (new Date(now.getFullYear(), now.getMonth(), now.getDate())).valueOf(),
					message: '^Введите корректную дату'
				}
			};
		} else {
			constraints[formKey].diagnostic_card_date_end = {
				presence: false,
			};
		}
		if (state.car.diagnostic_card_date_end) {
			constraints[formKey].diagnostic_card = {
				presence: true,
				format: {
					pattern: /^[0-9]{21}|[0-9]{15}$|^$/,
					message: '^Укажите номер диагностической карты (15 или 21 цифра подряд)'
				}
			}
		} else {
			constraints[formKey].diagnostic_card = {
				presence: false,
			}
		}
	}

	if (formKey === 'owner') {
		if (state.form.ownerIsAnInsurant) {
			return true;
		}
	}

	return validate(state[formKey], constraints[formKey]);
}

export function getFormArrayValidationResult(state, formKey) {
	const formData = state[formKey];
	const formConstraints = constraints[formKey];
	const validationResult = [];

	formData.forEach((form, index) => {
		if (formKey === 'drivers') {
			if (form.birthday) {
				let bd = new Date(form.birthday);
				formConstraints.date_experience.numericality.greaterThanOrEqualTo = new Date(bd.getFullYear() + 16, bd.getMonth(), bd.getDate()).valueOf();
			} else {
				let td = new Date();
				formConstraints.date_experience.numericality.greaterThanOrEqualTo = new Date(td.getFullYear() - 100, td.getMonth(), td.getDate()).valueOf();
			}
		}
		const result = validate(form, formConstraints);

		validationResult.push(result);
	});

	return validationResult;
}

export function getFormValidationStatus(state) {
	return {
		insurant: getFormValidationResult(state, 'insurant') === undefined,
		owner: state.form.ownerIsAnInsurant || getFormValidationResult(state, 'owner') === undefined,
		drivers: state.form.multidrive || getFormArrayValidationResult(state, 'drivers').reduce((result, validationResult) => result && validationResult === undefined, true),
		car: getFormValidationResult(state, 'car') === undefined,
	};
}

export function getFirstError(errorObject) {
	const newObject = {};

	if (errorObject) {
		Object.keys(errorObject).forEach((key) => {
			const value = errorObject[key];

			newObject[key] = value && value.length ? value[0] : value;
		});
	}

	return newObject;
}
