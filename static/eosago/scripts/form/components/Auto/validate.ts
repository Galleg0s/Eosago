import {
	ErrorTypes,
	getError
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';
import {
	MAX_POWER,
	MIN_AUTO_YEAR,
	today,
	YEAR_LENGTH
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {AutoFormFieldNames, FormValues} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export default function validate(values: FormValues) {
	const errors: any = {}; // TODO fix any

	if (!values[AutoFormFieldNames.brand]) {
		errors[AutoFormFieldNames.brand] = getError(AutoFormFieldNames.brand, ErrorTypes.existing);
	}

	if (!values[AutoFormFieldNames.model]) {
		errors[AutoFormFieldNames.model] = getError(AutoFormFieldNames.model, ErrorTypes.existing);
	}

	if (values[AutoFormFieldNames.year].length < YEAR_LENGTH) {
		errors[AutoFormFieldNames.year] = getError(AutoFormFieldNames.year, ErrorTypes.existing);
	}
	if (!values[AutoFormFieldNames.year]) {
		errors[AutoFormFieldNames.year] = getError(AutoFormFieldNames.year, ErrorTypes.existing);
	} else {
		const numberYear = parseInt(values[AutoFormFieldNames.year]);
		if (numberYear > today.getFullYear()) {
			errors[AutoFormFieldNames.year] = getError(AutoFormFieldNames.year, ErrorTypes.correct);
		}
		if (numberYear < MIN_AUTO_YEAR) {
			errors[AutoFormFieldNames.year] = getError(AutoFormFieldNames.year, ErrorTypes.correct);
		}
	}

	if (!values[AutoFormFieldNames.power]) {
		errors[AutoFormFieldNames.power] = getError(AutoFormFieldNames.power, ErrorTypes.existing);
	} else {
		const numberPower = parseInt(values[AutoFormFieldNames.power]);
		if (numberPower <= 0 || numberPower > MAX_POWER) {
			errors[AutoFormFieldNames.power] = getError(AutoFormFieldNames.power, ErrorTypes.correct);
		}
	}

	return errors;
}
