import moment from 'moment';
import {ErrorTypes, getError} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';
import {
	BIRTHDATE_CURRENT_YEAR_DIFF,
	DATE_INPUT_FORMAT,
	DATE_STRING_LENGTH,
	DRIVER_LICENSE_LENGTH,
	LICENSE_ISSUE_BIRTHDATE_DIFF,
	MAX_BIRTHDATE_DIFF,
	MAX_STRING_LENGTH,
	today
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {
	DriverFieldNames,
	PersonFieldNames,
	FormValues,
	PersonType,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export default function validate(values: FormValues) {
	const errors: any = {
		owner: {
			person: {},
		},
		insurant: {
			person: {}
		},
	}; // TODO fix any

	const validatePerson = (personType: PersonType) => {
		if (values[personType].person) {
			const { person } = values[personType];

			if (!person[PersonFieldNames.firstname] || person[PersonFieldNames.firstname].length === 0) {
				errors[personType].person[PersonFieldNames.firstname] = getError(PersonFieldNames.firstname, ErrorTypes.existing);
			} else if (person[PersonFieldNames.firstname].length > MAX_STRING_LENGTH) {
				errors[personType].person[PersonFieldNames.firstname] = getError(PersonFieldNames.firstname, ErrorTypes.max);
			}

			if (!person[PersonFieldNames.lastname] || person[PersonFieldNames.lastname].length === 0) {
				errors[personType].person[PersonFieldNames.lastname] = getError(PersonFieldNames.lastname, ErrorTypes.existing);
			} else if (person[PersonFieldNames.lastname].length > MAX_STRING_LENGTH) {
				errors[personType].person[PersonFieldNames.lastname] = getError(PersonFieldNames.lastname, ErrorTypes.max);
			}

			if (!person[PersonFieldNames.middlename] || person[PersonFieldNames.middlename].length === 0) {
				errors[personType].person[PersonFieldNames.middlename] = getError(PersonFieldNames.middlename, ErrorTypes.existing);
			} else if (person[PersonFieldNames.middlename].length > MAX_STRING_LENGTH) {
				errors[personType].person[PersonFieldNames.middlename] = getError(PersonFieldNames.middlename, ErrorTypes.max);
			}

			if (!person[PersonFieldNames.birthdate] || person[PersonFieldNames.birthdate].length === 0) {
				errors[personType].person[PersonFieldNames.birthdate] = getError(PersonFieldNames.birthdate, ErrorTypes.existing);
			} else {
				if (person[PersonFieldNames.birthdate].length !== DATE_STRING_LENGTH) {
					errors[personType].person[PersonFieldNames.birthdate] = getError(PersonFieldNames.birthdate, ErrorTypes.correct);
				} else {
					const birthDate = moment(person[PersonFieldNames.birthdate], DATE_INPUT_FORMAT);
					if (!birthDate.isValid()) {
						errors[personType].person[PersonFieldNames.birthdate] = getError(PersonFieldNames.birthdate, ErrorTypes.correct);
					} else {
						if (moment(today).diff(birthDate, 'year') < BIRTHDATE_CURRENT_YEAR_DIFF) {
							errors[personType].person[PersonFieldNames.birthdate] = getError(PersonFieldNames.birthdate, ErrorTypes.max);
						}
						if (moment(today).diff(birthDate, 'year') > MAX_BIRTHDATE_DIFF) {
							errors[personType].person[PersonFieldNames.birthdate] = getError(PersonFieldNames.birthdate, ErrorTypes.min);
						}
					}
				}
			}

			if (!person[DriverFieldNames.license] || person[DriverFieldNames.license].length === 0) {
				errors[personType].person[DriverFieldNames.license] = getError(DriverFieldNames.license, ErrorTypes.existing);
			} else if (person[DriverFieldNames.license].length !== DRIVER_LICENSE_LENGTH) {
				errors[personType].person[DriverFieldNames.license] = getError(DriverFieldNames.license, ErrorTypes.correct);
			}

			if (!person[DriverFieldNames.licenseIssueDate] || person[DriverFieldNames.licenseIssueDate].length === 0) {
				errors[personType].person[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.existing);
			} else {
				if (person[DriverFieldNames.licenseIssueDate].length !== DATE_STRING_LENGTH) {
					errors[personType].person[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.correct);
				} else {
					const licenseIssueDate = moment(person[DriverFieldNames.licenseIssueDate], DATE_INPUT_FORMAT);
					if (!licenseIssueDate.isValid()) {
						errors[personType].person[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.correct);
					} else {
						if (person[PersonFieldNames.birthdate] && person[PersonFieldNames.birthdate].length === DATE_STRING_LENGTH) {
							const birthDate = moment(person[PersonFieldNames.birthdate], DATE_INPUT_FORMAT);
							if (birthDate.isValid()) {
								if (licenseIssueDate.diff(birthDate, 'year') < LICENSE_ISSUE_BIRTHDATE_DIFF) {
									errors[personType].person[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.max);
								}
							}
						}
					}
				}
			}
		}
	}

	validatePerson(PersonType.insurant);
	validatePerson(PersonType.owner);

	return errors;
}
