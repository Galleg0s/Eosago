import moment from 'moment';
import {
	ErrorTypes,
	getError
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';
import {
	DATE_INPUT_FORMAT,
	DATE_STRING_LENGTH,
	PASSPORT,
	today
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {
	FormValues,
	PassportFieldNames,
	PersonFieldNames,
	PersonType,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

const { PASSPORT_LENGTH, EMITENT_CODE_LENGTH, EMITENT_NAME_MIN_LENGTH } = PASSPORT;

export default function validate(values: FormValues) {
	const errors: any = {
		owner: {
			passport: {},
		},
		insurant: {
			passport: {},
		},
	}; // TODO fix any

	const validatePassport = (personType: PersonType) => {
		const {passport} = values[personType];
		if (passport) {
			if (!passport[PassportFieldNames.seriesNumber]) {
				errors[personType].passport[PassportFieldNames.seriesNumber] = getError(PassportFieldNames.seriesNumber, ErrorTypes.existing);
			} else if (passport[PassportFieldNames.seriesNumber].length !== PASSPORT_LENGTH) {
				errors[personType].passport[PassportFieldNames.seriesNumber] = getError(PassportFieldNames.seriesNumber, ErrorTypes.correct);
			}

			if (!passport[PassportFieldNames.emitentCode]) {
				errors[personType].passport[PassportFieldNames.emitentCode] = getError(PassportFieldNames.emitentCode, ErrorTypes.existing);
			} else if (passport[PassportFieldNames.emitentCode].length < EMITENT_CODE_LENGTH) {
				errors[personType].passport[PassportFieldNames.emitentCode] = getError(PassportFieldNames.emitentCode, ErrorTypes.correct);
			}

			if (!passport[PassportFieldNames.emitent]) {
				errors[personType].passport[PassportFieldNames.emitent] = getError(PassportFieldNames.emitent, ErrorTypes.existing);
			} else if (passport[PassportFieldNames.emitent].length < EMITENT_NAME_MIN_LENGTH) {
				errors[personType].passport[PassportFieldNames.emitent] = getError(PassportFieldNames.emitent, ErrorTypes.min);
			}

			if (!passport[PassportFieldNames.issueDate] || passport[PassportFieldNames.issueDate].length === 0) {
				errors[personType].passport[PassportFieldNames.issueDate] = getError(PassportFieldNames.issueDate, ErrorTypes.existing);
			} else {
				if (passport[PassportFieldNames.issueDate].length !== DATE_STRING_LENGTH) {
					errors[personType].passport[PassportFieldNames.issueDate] = getError(PassportFieldNames.issueDate, ErrorTypes.correct);
				} else {
					const issueDate = moment(passport[PassportFieldNames.issueDate], DATE_INPUT_FORMAT);
					if (!issueDate.isValid()) {
						errors[personType].passport[PassportFieldNames.issueDate] = getError(PassportFieldNames.issueDate, ErrorTypes.correct);
					} else if (values[personType].person[PersonFieldNames.birthdate]) {
						if (issueDate.diff(moment(values[personType].person[PersonFieldNames.birthdate], DATE_INPUT_FORMAT), 'years', true) < 14) {
							errors[personType].passport[PassportFieldNames.issueDate] = getError(PassportFieldNames.issueDate, ErrorTypes.min);
						}
					}
				}
			}
		}
	}

	validatePassport(PersonType.owner);
	validatePassport(PersonType.insurant);

	return errors;
}
