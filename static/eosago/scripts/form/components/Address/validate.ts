import {
	AddressFieldNames, AutoIdentifierFieldNames,
	FormValues,
	IdentifierType,
	PersonType
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	ErrorTypes,
	getError
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';
import { matchRegExp } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';

export default function validate(values : FormValues) {
	const errors: any = {
		owner: {
			address: {},
		},
		insurant: {
			address: {},
		},
	};

	const validateAddress = (personType: PersonType) => {
		if (values[personType].address) {
			const { address} = values[personType];

			if (!address[AddressFieldNames.email]) {
				errors[personType].address[AddressFieldNames.email] = getError(AddressFieldNames.email, ErrorTypes.existing);
			} else {
				const isEmailCorrect = matchRegExp(address[AddressFieldNames.email].trim(), /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

				if (!isEmailCorrect) {
					errors[personType].address[AddressFieldNames.email] = getError(AddressFieldNames.email, ErrorTypes.correct);
				}
			}

			if (address[AddressFieldNames.registration].length === 0) {
				errors[personType].address[AddressFieldNames.registration] = getError(AddressFieldNames.registration, ErrorTypes.existing);
			} else if (!address[AddressFieldNames.registration].city && !address[AddressFieldNames.registration].settlement) {
				errors[personType].address[AddressFieldNames.registration] = getError(AddressFieldNames.registration, ErrorTypes.city);
			} else if (!address[AddressFieldNames.registration].house) {
				errors[personType].address[AddressFieldNames.registration] = getError(AddressFieldNames.registration, ErrorTypes.house);
			} else if (address[AddressFieldNames.registration].flat) {
				const isNaturalNumber = (value:string) => (Number(value) ^ 0) === Number(value);
				if (!isNaturalNumber(address[AddressFieldNames.registration].flat)) {
					errors[personType].address[AddressFieldNames.registration] = getError(AddressFieldNames.registration, ErrorTypes.flat);
				}
			}
		}
	}

	validateAddress(PersonType.owner);
	validateAddress(PersonType.insurant);

	return errors;
}

