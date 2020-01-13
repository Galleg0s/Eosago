export const CALCULATOR_URL = '/insurance/order/auto/type/eosago/';
export const LOGO_ALFA = '//static2.banki.ru/ugc/a3/95/c0/4b/alfastrah_135x85.gif';

export const IS_NOT_CONFIRMED = 'IS_NOT_CONFIRMED';
export const CHECK_RESULT_INFO_TIMEOUT = 'ICHECK_RESULT_INFO_TIMEOUT';
export const PAYMENT_URL_TIMEOUT = 'PAYMENT_URL_TIMEOUT';
export const IS_CONFIRMED = 2;
export const ALFA_PARTNER_ID = 18;
export const INTERVAL_REQUEST = 5;      // Количество секунд для интервала setTimeout
export const QUANTITY_REQUESTS = 30;    // Количество запросов перед выводом сообщения о таймауте

export const PHONE_ERROR_MESSAGE = 'Введите корректный телефон';
export const EMAIL_ERROR_MESSAGE = 'Введите корректную почту';
export const EMAIL_REG = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const defaultState = {
	car: null,
	checkResultId: null,
	drivers: null,
	email: null,
	phone: null,
	insurant: null,
	osago_policy_start_date: null,
	newHashRef: null,
	price: null,
	status: null,
	purchase_url: null,
	phoneStatus: null,
	emailStatus: null,
	isLoading: false,
	loadingCheck: false,
	loadingPurchase: false,
};
