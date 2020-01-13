import {
	AutoDocumentsFiledNames,
	AutoFormFieldNames,
	AutoIdentifierFieldNames,
	DriverFieldNames,
	PhoneVerificationFieldNames,
	PersonFieldNames,
	AddressFieldNames,
	PassportFieldNames,
	DiagnosticCardFieldNames,
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {MAX_STRING_LENGTH, PASSPORT} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';

export type FormFieldNames =
	AutoFormFieldNames |
	PhoneVerificationFieldNames |
	DriverFieldNames |
	DiagnosticCardFieldNames |
	AutoIdentifierFieldNames |
	DriverFieldNames |
	AutoDocumentsFiledNames |
	PersonFieldNames |
	AddressFieldNames |
	PassportFieldNames;

export const enum ErrorTypes {
	existing = 'existing',
	mustBeTrue = 'mustBeTrue',
	correct = 'correct',
	max = 'max',
	min = 'min',
	city = 'city',
	house = 'house',
	flat = 'flat',
	diff = 'diff',
}

export interface FieldErrors {
	[ErrorTypes.existing]?: string,
	[ErrorTypes.mustBeTrue]?: boolean,
	[ErrorTypes.correct]?: string,
	[ErrorTypes.max]?: string,
	[ErrorTypes.min]?: string,
	[ErrorTypes.diff]?: string,
	[ErrorTypes.city]?: string,
	[ErrorTypes.house]?: string,
	[ErrorTypes.flat]?: string,
	[ErrorTypes.diff]?: string,
}

export interface ValidationError {
	[key: string]: FieldErrors,
}

export interface ValidationError {
	[AutoFormFieldNames.brand]: FieldErrors,
	[AutoFormFieldNames.model]: FieldErrors,
	[AutoFormFieldNames.power]: FieldErrors,
	[AutoFormFieldNames.year]: FieldErrors,
	[PhoneVerificationFieldNames.code]: FieldErrors,
	[PhoneVerificationFieldNames.phone]: FieldErrors,
	[PhoneVerificationFieldNames.isAgreement]: FieldErrors,
	[PhoneVerificationFieldNames.isSubscribe]: FieldErrors,
	[AutoIdentifierFieldNames.licensePlate]: FieldErrors,
	[AutoIdentifierFieldNames.identifierType]: FieldErrors,
	[AutoIdentifierFieldNames.vinNumber]: FieldErrors,
	[AutoIdentifierFieldNames.bodyNumber]: FieldErrors,
	[DriverFieldNames.firstname]: FieldErrors,
	[DriverFieldNames.lastname]: FieldErrors,
	[DriverFieldNames.middlename]: FieldErrors,
	[DriverFieldNames.birthdate]: FieldErrors,
	[DriverFieldNames.license]: FieldErrors,
	[DriverFieldNames.licenseIssueDate]: FieldErrors,
	[DriverFieldNames.licenseFirstIssueDate]: FieldErrors,
	[AutoDocumentsFiledNames.seriesNumber]: FieldErrors,
	[AutoDocumentsFiledNames.issueDate]: FieldErrors,
	[DiagnosticCardFieldNames.number]: FieldErrors,
	[DiagnosticCardFieldNames.expirationDate]: FieldErrors,
}

export const ERRORS: ValidationError = {
	[AutoFormFieldNames.brand]: {
		[ErrorTypes.existing]: 'Укажите марку',
	},
	[AutoFormFieldNames.model]: {
		[ErrorTypes.existing]: 'Укажите модель',
	},
	[AutoFormFieldNames.power]: {
		[ErrorTypes.existing]: 'Укажите мощность',
		[ErrorTypes.correct]: 'Укажите корректную мощность',
	},
	[AutoFormFieldNames.year]: {
		[ErrorTypes.correct]: 'Укажите корректный год',
		[ErrorTypes.existing]: 'Укажите год',
	},
	[PhoneVerificationFieldNames.code]: {},
	[PhoneVerificationFieldNames.phone]: {
		[ErrorTypes.existing]: 'Укажите телефон',
		[ErrorTypes.correct]: 'Укажите корректный телефон'
	},
	[PhoneVerificationFieldNames.isSubscribe]: {
		[ErrorTypes.mustBeTrue]: true,
	},
	// [PhoneVerificationFieldNames.isSubscribe]: {},
	[AutoIdentifierFieldNames.licensePlate]: {
		[ErrorTypes.correct]: 'Укажите корректный номер',
	},
	[AutoIdentifierFieldNames.identifierType]: {},
	[AutoIdentifierFieldNames.bodyNumber]: {
		[ErrorTypes.existing]: 'Укажите кузов',
	},
	[AutoIdentifierFieldNames.vinNumber]: {
		[ErrorTypes.existing]: 'Укажите VIN',
		[ErrorTypes.correct]: 'VIN должен состоять из 17 символов, без O, I, Q',
	},
	[DriverFieldNames.firstname]: {
		[ErrorTypes.existing]: 'Укажите имя',
		[ErrorTypes.max]: `Максимальная длина поля: ${MAX_STRING_LENGTH} символов`,
	},
	[DriverFieldNames.lastname]: {
		[ErrorTypes.existing]: 'Укажите фамилию',
		[ErrorTypes.max]: `Максимальная длина поля: ${MAX_STRING_LENGTH} символов`,
	},
	[DriverFieldNames.middlename]: {
		[ErrorTypes.existing]: 'Укажите отчество',
		[ErrorTypes.max]: `Максимальная длина поля: ${MAX_STRING_LENGTH} символов`,
	},
	[DriverFieldNames.birthdate]: {
		[ErrorTypes.existing]: 'Укажите дату рождения',
		[ErrorTypes.correct]: 'Укажите корректную дату',
		[ErrorTypes.max]: 'Возраст не должен быть менее 18 лет',
		[ErrorTypes.min]: 'Возраст не должен быть более 90 лет',
	},
	[DriverFieldNames.license]: {
		[ErrorTypes.existing]: 'Укажите водительское удостоверение',
		[ErrorTypes.correct]: 'Укажите корректные серию и номер В/У',
	},
	[DriverFieldNames.licenseIssueDate]: {
		[ErrorTypes.existing]: 'Укажите дату выдачи действующего В/У',
		[ErrorTypes.max]: 'Разница возраст-выдача действующих прав не должна быть меньше 16 лет',
		[ErrorTypes.correct]: 'Укажите корректную дату выдачи действующего В/У',
		[ErrorTypes.diff]: 'Дата выдачи действующего В/У не может быть меньше даты выдачи первого В/У',
	},
	[DriverFieldNames.licenseFirstIssueDate]: {
		[ErrorTypes.existing]: 'Укажите дату выдачи первого В/У',
		[ErrorTypes.max]: 'Разница возраст-выдача первых прав не должна быть меньше 16 лет',
		[ErrorTypes.correct]: 'Укажите корректную дату выдачи первого В/У',
		[ErrorTypes.diff]: 'Дата выдачи первого В/У не может быть больше даты выдачи действующего В/У',
	},
	[AutoDocumentsFiledNames.seriesNumber]: {
		[ErrorTypes.existing]: 'Укажите номер документа',
		[ErrorTypes.correct]: 'Введите корректный номер',
	},
	[AutoDocumentsFiledNames.issueDate]: {
		[ErrorTypes.existing]: 'Укажите дату выдачи',
		[ErrorTypes.correct]: 'Введите корректную дату',
		[ErrorTypes.min]: 'Дата выдачи не должна быть меньше года выпуска авто',
	},
	[PersonFieldNames.firstname]: {
		[ErrorTypes.existing]: 'Укажите имя',
		[ErrorTypes.max]: `Максимальная длина поля: ${MAX_STRING_LENGTH} символов`,
	},
	[PersonFieldNames.lastname]: {
		[ErrorTypes.existing]: 'Укажите фамилию',
		[ErrorTypes.max]: `Максимальная длина поля: ${MAX_STRING_LENGTH} символов`,
	},
	[PersonFieldNames.middlename]: {
		[ErrorTypes.existing]: 'Укажите отчество',
		[ErrorTypes.max]: `Максимальная длина поля: ${MAX_STRING_LENGTH} символов`,
	},
	[PersonFieldNames.birthdate]: {
		[ErrorTypes.existing]: 'Укажите дату рождения',
		[ErrorTypes.correct]: 'Укажите корректную дату',
		[ErrorTypes.max]: 'Возраст не должен быть менее 18 лет',
		[ErrorTypes.min]: 'Возраст не должен быть более 90 лет',
	},
	[AddressFieldNames.email]: {
		[ErrorTypes.existing]: 'Укажите адрес электронной почты',
		[ErrorTypes.correct]: 'Укажите корректный адрес электронной почты',
	},
	[AddressFieldNames.registration]: {
		[ErrorTypes.existing]: 'Укажите адрес регистрации',
		[ErrorTypes.city]: 'Укажите город или поселок, номер дома и квартиры (если есть)',
		[ErrorTypes.house]: 'Укажите номер дома и квартиры (если есть)',
		[ErrorTypes.flat]: 'Номер квартиры должен быть целым числом',
	},
	[PassportFieldNames.seriesNumber]: {
		[ErrorTypes.existing]: 'Укажите серию и номер паспорта',
		[ErrorTypes.correct]: 'Укажите корректные серию и номер паспорта',
	},
	[PassportFieldNames.emitentCode]: {
		[ErrorTypes.existing]: 'Укажите код подразделения',
		[ErrorTypes.correct]: 'Укажите корректный код подразделения',
	},
	[PassportFieldNames.emitent]: {
		[ErrorTypes.existing]: 'Укажите, кем выдан паспорт',
		[ErrorTypes.min]: `Минимальная длина поля: ${PASSPORT.EMITENT_NAME_MIN_LENGTH} символа`,
	},
	[PassportFieldNames.issueDate]: {
		[ErrorTypes.existing]: 'Укажите дату выдачи паспорта',
		[ErrorTypes.correct]: 'Укажите корректную дату выдачи паспорта',
		[ErrorTypes.min]: 'Со дня рождения до даты выдачи паспорта должно пройти не менее 14 лет',
	},
	[DiagnosticCardFieldNames.number]: {
		[ErrorTypes.existing]: 'Укажите номер диагностической карты',
		[ErrorTypes.correct]: 'Номер диагностической карты должен состоять из 15 или 21 символа',
	},
	[DiagnosticCardFieldNames.expirationDate]: {
		[ErrorTypes.existing]: 'Заполните дату окончания действия диагностической карты',
		[ErrorTypes.correct]: 'Введите корректную дату',
		[ErrorTypes.min]: `Указанная дата окончания действия диагностической карты не соответствует правилам РСА:
		на момент оформления договора Е-ОСАГО необходимо иметь действующую диагностическую карту`,
	},
};

export function getError(fieldName: FormFieldNames, errorType: ErrorTypes) {
	return ERRORS[fieldName][errorType]
}
