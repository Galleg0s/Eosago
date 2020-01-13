import {
	ErrorTypes,
	getError
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';
import {
	FormValues,
	PhoneVerificationFieldNames
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {PHONE_LENGTH} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';

export default function validate(values: FormValues) {
	const errors: any = {}; // TODO fix any

	if (!values[PhoneVerificationFieldNames.isSubscribe]) {
		errors[PhoneVerificationFieldNames.isSubscribe] = getError(PhoneVerificationFieldNames.isSubscribe, ErrorTypes.mustBeTrue);
	}

	if (!values[PhoneVerificationFieldNames.phone]) {
		errors[PhoneVerificationFieldNames.phone] = getError(PhoneVerificationFieldNames.phone, ErrorTypes.existing);
	} else if (values[PhoneVerificationFieldNames.phone].length !== PHONE_LENGTH) {
		errors[PhoneVerificationFieldNames.phone] = getError(PhoneVerificationFieldNames.phone, ErrorTypes.correct);
	}

	return errors;
}
