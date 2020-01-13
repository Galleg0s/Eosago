import router from 'router';

export const SET_ACCIDENT_FREE = 'SET_ACCIDENT_FREE';
export const SET_CAR_PROP = 'SET_CAR_PROP';
export const SET_CAR_PROPS = 'SET_CAR_PROPS';
export const SET_INSURANT_PROP = 'SET_INSURANT_PROP';
export const SET_INSURANT_PROPS = 'SET_INSURANT_PROPS';
export const SET_OWNER_PROP = 'SET_OWNER_PROP';
export const SET_OWNER_PROPS = 'SET_OWNER_PROPS';
export const CLEAR_OWNER = 'CLEAR_OWNER';
export const ADD_DRIVER = 'ADD_DRIVER';
export const REMOVE_DRIVER = 'REMOVE_DRIVER';
export const SET_DRIVER_PROP = 'SET_DRIVER_PROP';
export const SET_DRIVER_PROPS = 'SET_DRIVER_PROPS';
export const SET_MULTIDRIVE = 'SET_MULTIDRIVE';
export const SET_OWNER_IS_AN_INSURANT = 'SET_OWNER_IS_AN_INSURANT';
export const SET_SELECTED_STEP = 'SET_SELECTED_STEP';
export const SET_COMPANY_ID = 'SET_COMPANY_ID';
export const SEND_FORM_DATA = 'SEND_FORM_DATA';
export const SET_DEFAULT_PROPS = 'SET_DEFAULT_PROPS';
export const SET_RESULT = 'SET_RESULT';
export const SET_RESULT_STATUS = 'SET_RESULT_STATUS';
export const SET_POLICIES_PROPS = 'SET_POLICIES_PROPS';
export const SET_OFFER_PROP = 'SET_OFFER_PROP';
export const SET_OFFER_PROPS = 'SET_OFFER_PROPS';
export const SET_OSAGO_POLICY_START_DATE_MESSAGE = 'SET_OSAGO_POLICY_START_DATE_MESSAGE';
export const SMS_CODE_INVALID = 'SMS_CODE_INVALID';
export const VERIFY_PHONE_NUMBER = 'VERIFY_PHONE_NUMBER';
export const CANCEL_RESULT = 'CANCEL_RESULT';
export const SHOW_URL_TO_RESULT = 'SHOW_URL_TO_RESULT';
export const SHOW_URL_TO_EMAIL = 'SHOW_URL_TO_EMAIL';
export const SERVICE_IS_UNAVAILABLE = 'SERVICE_IS_UNAVAILABLE';
export const SHOW_LOADING = 0;
export const SHOW_RESULTS = 1;
export const SHOW_RESULTS_TO_EMAIL = 2;
export const SHOW_RGS_SMS_AUTH = 'SHOW_RGS_SMS_AUTH';
export const SET_RGS_CODE = 'SET_RGS_CODE';
export const SET_RGS_CODE_ERROR = 'SET_RGS_CODE_ERROR';
export const SET_PAYMENT_URL = 'SET_PAYMENT_URL';
export const SET_DID_RESULTS = 'SET_DID_RESULTS';
export const SET_TEST = 'SET_TEST';
export const SET_ERRORS = 'SET_ERRORS';
export const SET_AGREEMENT_ID = 'SET_AGREEMENT_ID';
export const SET_PURCHASE_ID = 'SET_PURCHASE_ID';
export const SET_EOSAGO_PAGE = 'SET_EOSAGO_PAGE';

export const defaultState = {
	form: {
		accident_free: false,
		isFormSubmitted: false,
		didResultsUpdated: false,
		selectedStepIndex: 0,
		multidrive: false,
		ownerIsAnInsurant: true,
		isSmsCodeInvalid: false,
		isPhoneVerified: undefined,
		osago_policy_start_date_message: false,
		paymentUrls: [],
		partner_errors: [],
		rgs: {},
		eosagoPage: false,
	},
	result: {
		results: [],
	},
	car: {
		identifier: 'vin',
		vin: null,
		body_number: null,
		has_trailer: false,
		used_as_taxi: false,
		registration_passport_type: 'STS'	// 'STS' or 'PTS'
	},
	insurant: {
		gender: 'm',
		addresses_are_equal: true,
		subscribe: true
	},
	owner: {
		gender: 'm',
		addresses_are_equal: true
	},
	drivers: [
		{}
	],
	offer: {
	},
	policies: {
		paperPolicy: {},
		allPaperPolicies: [],
		eosagoPolicies: [],
	}
};

export const OSAGO_PERIODS = {
	1: '3 месяца',
	2: '4 месяца',
	3: '5 месяцев',
	4: '6 месяцев',
	5: '7 месяцев',
	6: '8 месяцев',
	7: '9 месяцев',
	8: '1 год'
};

export const TODAY = new Date();

export const gaCategory = 'INS_e-OSAGO';

export const eOSAGOPopupContainerClass = 'e-osago-popup-container';

export const CAR_IDENTIFIERS = [
	{
		id: 'vin',
		name: 'VIN-номер'
	},
	{
		id: 'body_number',
		name: 'Номер кузова'
	}
];

export const EOSAGO_STEPS = {
	insurant: 0,
	owner: 1,
	drivers: 2,
	car: 3,
};

export const INGOS_COMPANY_ID = 3;
export const SOGLASIE_COMPANY_ID = 5;
export const ALFA_COMPANY_ID = 6; // Альфастрахование
export const ALFA_PLUS_COMPANY_ID = 4407; // Альфастрахование ПЛЮС
export const NASKO_COMPANY_ID = 43;
export const RGS_COMPANY_ID = 123;
export const TINKOFF_COMPANY_ID = 127;
export const RGS_CODE_ERROR_MSG = 'Неверный код';
