import moment from 'moment';
import {
	ErrorTypes,
	getError
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';
import {
	AUTO_DOCUMENT_LENGTH,
	DATE_INPUT_FORMAT,
	DATE_STRING_LENGTH,
	today
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {
	AutoDocumentsFiledNames,
	AutoFormFieldNames,
	FormValues
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export default function validate(values: FormValues) {
	const errors: any = {}; // TODO fix any

	if (!values[AutoDocumentsFiledNames.seriesNumber] || values[AutoDocumentsFiledNames.seriesNumber].length === 0) {
		errors[AutoDocumentsFiledNames.seriesNumber] = getError(AutoDocumentsFiledNames.seriesNumber, ErrorTypes.existing);
	} else if (values[AutoDocumentsFiledNames.seriesNumber].length !== AUTO_DOCUMENT_LENGTH) {
		errors[AutoDocumentsFiledNames.seriesNumber] = getError(AutoDocumentsFiledNames.seriesNumber, ErrorTypes.correct);
	}

	if (!values[AutoDocumentsFiledNames.issueDate] || values[AutoDocumentsFiledNames.issueDate].length === 0) {
		errors[AutoDocumentsFiledNames.issueDate] = getError(AutoDocumentsFiledNames.issueDate, ErrorTypes.existing);
	} else {
		if (values[AutoDocumentsFiledNames.issueDate].length !== DATE_STRING_LENGTH) {
			errors[AutoDocumentsFiledNames.issueDate] = getError(AutoDocumentsFiledNames.issueDate, ErrorTypes.correct);
		} else {
			const issueDate = moment(values[AutoDocumentsFiledNames.issueDate], DATE_INPUT_FORMAT);
			if (!issueDate.isValid()) {
				errors[AutoDocumentsFiledNames.issueDate] = getError(AutoDocumentsFiledNames.issueDate, ErrorTypes.correct);
			} else {
				if (issueDate.diff(moment(today), 'day', true) > 0) {
					errors[AutoDocumentsFiledNames.issueDate] = getError(AutoDocumentsFiledNames.issueDate, ErrorTypes.correct);
				}
				if (values[AutoFormFieldNames.year]) {
					const carYear = parseInt(values[AutoFormFieldNames.year]);
					if (carYear && ((carYear > issueDate.get('year')))) {
						errors[AutoDocumentsFiledNames.issueDate] = getError(AutoDocumentsFiledNames.issueDate, ErrorTypes.min);
					}
				}
			}
		}
	}

	return errors;
}
