import moment from 'moment';
import {
	DiagnosticCardFieldNames,
	FormValues
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {DATE_INPUT_FORMAT, today} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {ErrorTypes, getError} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';

const DC_MIN_LENGTH = 15;
const DC_MAX_LENGTH = 21;

export default (values: FormValues) => {
	const errors: any = {
		diagnosticCardNumber: '',
		diagnosticCardExpirationDate: '',
	};

	const formattedExpirationDate = moment(values[DiagnosticCardFieldNames.expirationDate], DATE_INPUT_FORMAT);
	// If the moment is earlier than the moment you are passing to moment.fn.diff, the return value will be negative.
	const isExpirationDateIsEarlierThanTomorrow = formattedExpirationDate.diff(today, 'days', true) < 0;
	const isInvalidDate = values[DiagnosticCardFieldNames.expirationDate].length < 10 || !formattedExpirationDate.isValid();
	const isInvalidNumber = !(values[DiagnosticCardFieldNames.number].length === DC_MIN_LENGTH || values[DiagnosticCardFieldNames.number].length === DC_MAX_LENGTH);

	if (!values[DiagnosticCardFieldNames.number].length) {
		errors[DiagnosticCardFieldNames.number] = getError(DiagnosticCardFieldNames.number, ErrorTypes.existing);
	} else if (isInvalidNumber) {
		errors[DiagnosticCardFieldNames.number] = getError(DiagnosticCardFieldNames.number, ErrorTypes.correct);
	}

	if (!values[DiagnosticCardFieldNames.expirationDate]) {
		errors[DiagnosticCardFieldNames.expirationDate] = getError(DiagnosticCardFieldNames.expirationDate, ErrorTypes.existing);
	} else if (isInvalidDate) {
		errors[DiagnosticCardFieldNames.expirationDate] = getError(DiagnosticCardFieldNames.expirationDate, ErrorTypes.correct);
	} else if (isExpirationDateIsEarlierThanTomorrow) {
		errors[DiagnosticCardFieldNames.expirationDate] = getError(DiagnosticCardFieldNames.expirationDate, ErrorTypes.min);
	}

	return errors;
};
