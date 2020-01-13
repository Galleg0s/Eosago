import {
	AutoIdentifierFieldNames,
	FormValues,
	IdentifierType
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	ErrorTypes,
	getError
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';
import {MIN_LICENSE_PLATE_LENGTH} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';


export default function validate(values: FormValues) {
	const errors: any = {}; // TODO fix any

	if (values[AutoIdentifierFieldNames.identifierType] === IdentifierType.vin) {
		if (!values[AutoIdentifierFieldNames.vinNumber]) {
			errors[AutoIdentifierFieldNames.vinNumber] = getError(AutoIdentifierFieldNames.vinNumber, ErrorTypes.existing);
		} else if (values[AutoIdentifierFieldNames.vinNumber].length !== 17) {
			errors[AutoIdentifierFieldNames.vinNumber] = getError(AutoIdentifierFieldNames.vinNumber, ErrorTypes.correct);
		}
	}
	if (values[AutoIdentifierFieldNames.identifierType] === IdentifierType.body) {
		if (!values[AutoIdentifierFieldNames.bodyNumber] || values[AutoIdentifierFieldNames.bodyNumber].length === 0) {
			errors[AutoIdentifierFieldNames.bodyNumber] = getError(AutoIdentifierFieldNames.bodyNumber, ErrorTypes.existing);
		}
	}

	if (!!values[AutoIdentifierFieldNames.licensePlate] && values[AutoIdentifierFieldNames.licensePlate].length !== 0) {
		if (values[AutoIdentifierFieldNames.licensePlate].length < MIN_LICENSE_PLATE_LENGTH) {
			errors[AutoIdentifierFieldNames.licensePlate] = getError(AutoIdentifierFieldNames.licensePlate, ErrorTypes.correct);
		}
	}

	return errors;
}
