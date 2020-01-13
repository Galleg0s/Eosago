import moment from 'moment';
import {
	AddressFieldNames,
	AutoDocumentsFiledNames,
	AutoFormFieldNames,
	AutoIdentifierFieldNames,
	DiagnosticCardFieldNames,
	EmptyDriver,
	FormStep,
	FormValues,
	IdentifierType,
	mediaQueryInterface,
	PassportFieldNames,
	PersonFieldNames,
	PersonType,
	PhoneVerificationFieldNames,
	PoliceDatesFieldNames
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export const OSAGO_FORM_NAME: string = 'OSAGO_FORM';

export const FORM_TITLES = {
	[PersonType.insurant]: {
		person: 'Страхователь',
		passport: 'страхователя',
		address: 'страхователя',
	},
	[PersonType.owner]: {
		person: 'Собственник',
		passport: 'собственника',
		address: 'собственника',
	}
};

export const SMS_RESEND_SECS = 60;

export const mediaQuery: mediaQueryInterface = {
	xs: {
		maxWidth: 567
	},
	// Horizontal phone
	hxs: {
		maxWidth: 767
	},
	// Small screen / tablet
	sm: {
		maxWidth: 1023
	},
	// Horizontal tablet
	hsm: {
		maxWidth: 1279
	},
	// Medium screen / desktop
	md: {
		maxWidth: 1365
	},
	// Large screen / desktop
	lg: {
		maxWidth: 1439
	},
	// Extra large screen / wide desktop
	xl: {
		minWidth: 1440
	}
};

export const CHANGE = '@@redux-form/CHANGE';
export const INITIALIZE = '@@redux-form/INITIALIZE';

export const today = new Date();
export let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
export const currentYear = today.getFullYear();
export const DATE_ISO_FORMAT = 'YYYY-MM-DD';
export const DATE_INPUT_FORMAT = 'DD.MM.YYYY';

export const PASSPORT = {
	PASSPORT_LENGTH: 12,
	EMITENT_CODE_LENGTH: 7,
	EMITENT_NAME_MIN_LENGTH: 2,
};

export const MAX_STRING_LENGTH = 50;
export const DATE_STRING_LENGTH = 10;

export const YEAR_LENGTH = 4;
export const PREVIOUS_CENTURY_FIRST_YEAR = 1900;

export const DRIVER_LICENSE_LENGTH = 12;
export const MIN_LICENSE_PLATE_LENGTH = 8;
export const LICENSE_ISSUE_BIRTHDATE_DIFF = 16;
export const BIRTHDATE_CURRENT_YEAR_DIFF = 18;
export const MAX_BIRTHDATE_DIFF = 90;

export const MAX_POWER = 1500;
export const MIN_AUTO_YEAR = 1900;

export const AUTO_DOCUMENT_LENGTH = 10;

export const PHONE_LENGTH = 10;
export const VERIFICATION_CODE_LENGTH = 4;

export const LOADER_CONFIG = {
	LOADER_START_PERCENT: 60,  // начальное значение лодаера, %
	LOADER_STEP: 5,            // значение, на которое увеличивается лоадер, %
	LOADER_FREQ: 2000,         // частота обновления значения лоадера, мс
};

export const PAYMENT_URL_REQUEST_DELAY = 5;      // Количество секунд между запросами к серверу
export const PAYMENT_URL_REQUEST_LIMIT = 30;     // Количество запросов перед выводом сообщения о таймауте

export const RESULT_INFO_REQUEST_DELAY = 4;      // Количество секунд между запросами к серверу
export const RESULT_INFO_URL_REQUEST_LIMIT = 30; // Количество запросов перед выводом сообщения о таймауте

export const FORM_INITIAL_VALUES: FormValues = {
	[AutoFormFieldNames.brand]: undefined,
	[AutoFormFieldNames.year]: '',
	[AutoFormFieldNames.model]: undefined,
	[AutoFormFieldNames.power]: '',
	[AutoDocumentsFiledNames.seriesNumber]: '',
	[AutoDocumentsFiledNames.issueDate]: '',
	[AutoIdentifierFieldNames.identifierType]: IdentifierType.vin,
	[AutoIdentifierFieldNames.vinNumber]: '',
	[AutoIdentifierFieldNames.bodyNumber]: '',
	[AutoIdentifierFieldNames.licensePlate]: '',
	[PhoneVerificationFieldNames.phone]: '',
	[PhoneVerificationFieldNames.code]: '',
	[PhoneVerificationFieldNames.isSubscribe]: true,
	[PhoneVerificationFieldNames.isAgreement]: true,
	[PoliceDatesFieldNames.period]: 8,
	[PoliceDatesFieldNames.dateStart]: moment().add(4, 'day').format(DATE_ISO_FORMAT),
	[DiagnosticCardFieldNames.number]: '',
	[DiagnosticCardFieldNames.expirationDate]: '',
	/*TODO если пользователь закончил заполнение формы, и driversIsNoRestriction === true, то нужно очистить drivers, чтобы они не попали в запрос*/
	driversIsNoRestriction: false,
	drivers: [EmptyDriver],
	[PersonType.owner]: {
		person: {
			[PersonFieldNames.isInsurant]: true,
			[PersonFieldNames.firstname]: '',
			[PersonFieldNames.lastname]: '',
			[PersonFieldNames.middlename]: '',
			[PersonFieldNames.birthdate]: '',
		},
		passport: {
			[PassportFieldNames.seriesNumber]: '',
			[PassportFieldNames.emitentCode]: '',
			[PassportFieldNames.emitent]: '',
			[PassportFieldNames.issueDate]: '',
		},
		address: {
			[AddressFieldNames.email]: '',
			[AddressFieldNames.registration]: {}
		},
	},
	[PersonType.insurant]: {
		person: {
			[PersonFieldNames.firstname]: '',
			[PersonFieldNames.lastname]: '',
			[PersonFieldNames.middlename]: '',
			[PersonFieldNames.birthdate]: '',
		},
		passport: {
			[PassportFieldNames.seriesNumber]: '',
			[PassportFieldNames.emitentCode]: '',
			[PassportFieldNames.emitent]: '',
			[PassportFieldNames.issueDate]: '',
		},
		address: {
			[AddressFieldNames.email]: '',
			[AddressFieldNames.registration]: {}
		},
	}
};

export const INSURANT_STEPS = [FormStep.insurantGeneral, FormStep.insurantPassport, FormStep.insurantAddress];

export const SCROLL_ANCHOR_ID = 'osago-scroll-anchor';
export const SCROLL_DELAY = 200;
export const MOBILE_DEVICE_WIDTH = 768;
