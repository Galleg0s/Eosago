import Hash from '../../_common/utils/hash.js';
import { strToHash, paramObjToStr } from 'helpers';
import { prepareStepItems, getFormValidationStatus, getInsurantState, getOwnerState } from './selectors.js';
import { convertTimestampToStr, clearPhoneNumber, transformPaperPolices } from './utils.js';
import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';

import {
	SET_ACCIDENT_FREE,
	SET_CAR_PROP,
	SET_CAR_PROPS,
	SET_INSURANT_PROP,
	SET_INSURANT_PROPS,
	SET_OWNER_PROP,
	SET_OWNER_PROPS,
	CLEAR_OWNER,
	ADD_DRIVER,
	REMOVE_DRIVER,
	SET_DRIVER_PROP,
	SET_DRIVER_PROPS,
	SET_MULTIDRIVE,
	SET_OWNER_IS_AN_INSURANT,
	SET_SELECTED_STEP,
	SET_COMPANY_ID,
	SEND_FORM_DATA,
	SET_DEFAULT_PROPS,
	SET_RESULT,
	SET_RESULT_STATUS,
	SET_POLICIES_PROPS,
	SET_OFFER_PROP,
	SET_OFFER_PROPS,
	SMS_CODE_INVALID,
	VERIFY_PHONE_NUMBER,
	CANCEL_RESULT,
	SHOW_URL_TO_RESULT,
	SHOW_URL_TO_EMAIL,
	SERVICE_IS_UNAVAILABLE,
	SET_PAYMENT_URL,
	SET_DID_RESULTS,
	SET_ERRORS,
	SHOW_LOADING,
	SHOW_RESULTS_TO_EMAIL,
	RGS_COMPANY_ID, SHOW_RGS_SMS_AUTH,
	SET_AGREEMENT_ID,
	SET_RGS_CODE,
	RGS_CODE_ERROR_MSG,
	SET_RGS_CODE_ERROR,
	SET_PURCHASE_ID, SHOW_RESULTS,
	SET_EOSAGO_PAGE,
} from './constants';
import {falseFunc} from './utils';

let resultHashref;
const EOSAGO_SEND_USER_DATA_TYPE = 1;

const setAgreementId = (agreementId) => ({ type: SET_AGREEMENT_ID, params: { agreementId } });
const cancelResult = () => ({ type: CANCEL_RESULT });

function _setFormProps(type, data) {
	return { type: type, params: {data} };
}

export function setPartnerErrors(partner_errors) {
	return { type: SET_ERRORS, params: { partner_errors } };
}

export function setCarProp(prop, value) {
	return { type: SET_CAR_PROP, params: {prop, value} };
}

export function setCarProps(data) {
	return { type: SET_CAR_PROPS, params: {data} };
}

export function setPoliciesProps(paperPolicy, allPaperPolicies, eosagoPolicies) {
	return { type: SET_POLICIES_PROPS, params: { paperPolicy: paperPolicy, allPaperPolicies: allPaperPolicies, eosagoPolicies: eosagoPolicies } };
}

export function setOfferProp(prop, value) {
	return { type: SET_OFFER_PROP, params: {prop, value} };
}

export function setOfferProps(data) {
	return { type: SET_OFFER_PROPS, params: {data} };
}

export function setInsurantProp(prop, value) {
	return (dispatch, getState) => {
		const insurantState = getInsurantState(getState());
		const accident_free = getState().form.accident_free;

		if (prop === 'registration_address' && insurantState.addresses_are_equal === true) {
			dispatch(_setFormProps(SET_INSURANT_PROPS, {registration_address: value, address_actual: value}));
		} else if (prop === 'addresses_are_equal' && value === true) {
			dispatch(_setFormProps(SET_INSURANT_PROPS, {[prop]: value, address_actual: insurantState.registration_address}));
		} else {
			return dispatch({ type: SET_INSURANT_PROP, params: {prop, value, accident_free} });
		}
	};
}

export function setInsurantProps(data) {
	return { type: SET_INSURANT_PROPS, params: {data} };
}

export function setOwnerProp(prop, value) {
	return (dispatch, getState) => {
		const ownerState = getOwnerState(getState());

		if (prop === 'registration_address' && ownerState.addresses_are_equal === true) {
			dispatch(_setFormProps(SET_OWNER_PROPS, {registration_address: value, address_actual: value}));
		} else if (prop === 'addresses_are_equal' && value === true) {
			dispatch(_setFormProps(SET_OWNER_PROPS, {[prop]: value, address_actual: ownerState.registration_address}));
		} else {
			return dispatch({ type: SET_OWNER_PROP, params: {prop, value} });
		}
	};
}

export function setOwnerProps(data) {
	return { type: SET_OWNER_PROPS, params: {data} };
}

export function addDriver() {
	return { type: ADD_DRIVER };
}

export function removeDriver(index) {
	return { type: REMOVE_DRIVER, params: {index} };
}

export function setDriverProp(index, prop, value) {
	return { type: SET_DRIVER_PROP, params: {index, prop, value} };
}

export function setDriverProps(index, data) {
	return { type: SET_DRIVER_PROPS, params: {index, data} };
}

export function setAccidentFree(value) {
	return { type: SET_ACCIDENT_FREE, params: {value} };
}

export function setMultidrive(value) {
	return { type: SET_MULTIDRIVE, params: {value} };
}

export function setOwnerIsAnInsurant(value) {
	return { type: SET_OWNER_IS_AN_INSURANT, params: {value} };
}

export function clearOwner() {
	return { type: CLEAR_OWNER };
}

export function setCompanyId(id) {
	return { type: SET_COMPANY_ID, params: {id} };
}

export function setSmsCodeValid(value) {
	return { type: SMS_CODE_INVALID, params: {value} };
}

function _setSelectedStep(index) {
	return { type: SET_SELECTED_STEP, params: {index} };
}

export function setDefaultProps() {
	return { type: SET_DEFAULT_PROPS };
}

export function tryToSetSelectedStep(index) {
	return (dispatch, getState) => {
		const formValidationStatus = getFormValidationStatus(getState());
		const processedSteps = prepareStepItems(formValidationStatus, 'formKey');

		if (index === 0 || processedSteps[index - 1].success === true) {
			dispatch(_setSelectedStep(index));
			eventEmitter.emit('insurance:e-osago-step-changed');
		}
	};
}

export function sendFormData() {
	return (dispatch, getState) => {
		dispatch({ type: SEND_FORM_DATA });

		const calculate = Hash.get();

		const {
			form: {
				ownerIsAnInsurant,
				multidrive,
				company_id
			},
			car: {
				osago_period,
				osago_policy_start_date,
				diagnostic_card,
				diagnostic_card_date_end,
				power,
				license_plate,
				has_trailer,
				vin,
				body_number,
				registration_passport,
				registration_passport_date,
				registration_passport_type,
				brand_id,
				brand_title,
				model_id,
				model_title,
				modification_id,
				modification_title,
				year,
			},
			insurant: {
				gender,
				firstname,
				lastname,
				patronymic,
				birthday,
				phone,
				email,
				subscribe,
				passport_series,
				passport_number,
				passport_issue_date,
				passport_emitent,

				addresses_are_equal,
				// registration address
				registration_area,
				registration_city,
				registration_city_with_type,
				registration_city_kladr_id,
				registration_settlement,
				registration_settlement_with_type,
				registration_settlement_kladr_id,
				registration_flat,
				registration_house,
				registration_house_with_type,
				registration_building,
				registration_postcode,
				registration_region,
				registration_region_with_type,
				registration_region_kladr_id,
				registration_street,
				registration_street_with_type,
				registration_street_kladr_id,
				// actual address
				actual_city,
				actual_city_kladr_id,
				actual_settlement,
				actual_settlement_kladr_id,
				actual_flat,
				actual_house,
				actual_postcode,
				actual_region,
				actual_region_kladr_id,
				actual_street,
				actual_street_kladr_id,
			},
			owner,
			drivers } = getState();

		let registration_passport_date_str =	convertTimestampToStr(registration_passport_date);
		let insurant_birthday_str =				convertTimestampToStr(birthday);
		let owner_birthday_str =				convertTimestampToStr(owner.birthday);
		let insurant_passport_issue_date_str =	convertTimestampToStr(passport_issue_date);
		let owner_passport_issue_date_str =		convertTimestampToStr(owner.passport_issue_date);
		let diagnostic_card_date_end_date_str = diagnostic_card_date_end ? convertTimestampToStr(diagnostic_card_date_end) : null;

		let license_plate_trimmed = license_plate ? license_plate.replace(/\s/g, '') : '';

		let drivers_data;
		if (!multidrive) {
			drivers_data = drivers.map((driver) => {
				let driver_birthday_str = convertTimestampToStr(driver.birthday);
				let driver_first_issue_date_str = convertTimestampToStr(driver.date_experience);

				return {
					gender: driver.gender,
					firstname: driver.firstname,
					lastname: driver.lastname,
					patronymic: driver.patronymic,
					birthday: driver_birthday_str,
					license: {
						license_series: driver.license_series,
						license_number: driver.license_number,
						date_experience: driver_first_issue_date_str
					}
				}
			});
		}

		let registration_passport_series = registration_passport.replace(/\s/g, '').slice(0, 4);
		let registration_passport_number = registration_passport.replace(/\s/g, '').slice(-6);

		const dataObj = {
			company_id,
			osago_period,
			osago_policy_start_date: osago_policy_start_date.toString().replace(/.....$/, '03:00'),
			multidrive,
			calculate,
			subscribe,
			car: {
				power,
				license_plate: license_plate_trimmed,
				has_trailer,
				vin,
				body_number,
				diagnostic_card_number: diagnostic_card,
				diagnostic_card_date_end: diagnostic_card_date_end_date_str,
				brand_id,
				brand_title,
				model_id,
				model_title,
				modification_id,
				modification_title,
				year,
				vehicle_document: {
					series: registration_passport_series,
					number: registration_passport_number,
					issue_date: registration_passport_date_str,
					type: registration_passport_type
				}
			},
			insurant: {
				sex: gender,
				first_name: firstname,
				last_name: lastname,
				patronymic,
				birthday: insurant_birthday_str,
				phone: clearPhoneNumber(phone),
				email,
				address_registration: {
					postcode: registration_postcode,
					area: registration_area,
					region_code_kladr: registration_region_kladr_id,
					region: registration_region,
					region_with_type: registration_region_with_type,
					city: registration_city,
					city_with_type: registration_city_with_type,
					city_code_kladr: registration_city_kladr_id,
					settlement: registration_settlement,
					settlement_with_type: registration_settlement_with_type,
					settlement_kladr_id: registration_settlement_kladr_id,
					street: registration_street,
					street_with_type: registration_street_with_type,
					street_code_kladr: registration_street_kladr_id,
					house: registration_house,
					house_with_type: registration_house_with_type,
					building: registration_building,
					flat: registration_flat,
				},
				address_actual: {
					postcode: registration_postcode,
					area: registration_area,
					region_code_kladr: registration_region_kladr_id,
					region: registration_region,
					region_with_type: registration_region_with_type,
					city: registration_city,
					city_with_type: registration_city_with_type,
					city_code_kladr: registration_city_kladr_id,
					settlement: registration_settlement,
					settlement_with_type: registration_settlement_with_type,
					settlement_kladr_id: registration_settlement_kladr_id,
					street: registration_street,
					street_with_type: registration_street_with_type,
					street_code_kladr: registration_street_kladr_id,
					house: registration_house,
					house_with_type: registration_house_with_type,
					building: registration_building,
					flat: registration_flat,
				},
				passport: {
					series: passport_series.replace(/\s/g, ''),
					number: passport_number,
					issue_date: insurant_passport_issue_date_str,
					issued_by: passport_emitent
				}
			},
			drivers: !drivers_data ? [] : drivers_data.map((driver) => {
				return {
					sex: driver.gender,
					first_name: driver.firstname,
					last_name: driver.lastname,
					patronymic: driver.patronymic,
					birthday: driver.birthday,
					license: {
						series: driver.license.license_series,
						number: driver.license.license_number,
						first_issue_date: driver.license.date_experience
					}
				}
			})
		};

		if (ownerIsAnInsurant) {
			dataObj.owner = dataObj.insurant;
		} else {
			dataObj.owner = {
				sex: owner.gender,
				first_name: owner.firstname,
				last_name: owner.lastname,
				patronymic: owner.patronymic,
				birthday: owner_birthday_str,
				phone: clearPhoneNumber(owner.phone),
				email: owner.email,
				address_registration: {
					postcode: owner.registration_postcode,
					area: owner.registration_area,
					region_code_kladr: owner.registration_region_kladr_id,
					region: owner.registration_region,
					region_with_type: owner.registration_region_with_type,
					city: owner.registration_city,
					city_with_type: owner.registration_city_with_type,
					city_code_kladr: owner.registration_city_kladr_id,
					settlement: owner.registration_settlement,
					settlement_with_type: owner.registration_settlement_with_type,
					settlement_kladr_id: owner.registration_settlement_kladr_id,
					street: owner.registration_street,
					street_with_type: owner.registration_street_with_type,
					street_code_kladr: owner.registration_street_kladr_id,
					house: owner.registration_house,
					house_with_type: owner.registration_house_with_type,
					building: owner.registration_building,
					flat: owner.registration_flat,
				},
				address_actual: {
					postcode: owner.registration_postcode,
					area: owner.registration_area,
					region_code_kladr: owner.registration_region_kladr_id,
					region: owner.registration_region,
					region_with_type: owner.registration_region_with_type,
					city: owner.registration_city,
					city_with_type: owner.registration_city_with_type,
					city_code_kladr: owner.registration_city_kladr_id,
					settlement: owner.registration_settlement,
					settlement_with_type: owner.registration_settlement_with_type,
					settlement_kladr_id: owner.registration_settlement_kladr_id,
					street: owner.registration_street,
					street_with_type: owner.registration_street_with_type,
					street_code_kladr: owner.registration_street_kladr_id,
					house: owner.registration_house,
					house_with_type: owner.registration_house_with_type,
					building: owner.registration_building,
					flat: owner.registration_flat,
				},
				passport: {
					series: owner.passport_series.replace(/\s/g, ''),
					number: owner.passport_number,
					issue_date: owner_passport_issue_date_str,
					issued_by: owner.passport_emitent
				}
			}
		}

		dataObj.request_guid = `${strToHash(JSON.stringify(dataObj))}-${(~~(Math.random() * 1e8)).toString(16)}`;
		dataObj.is_agent = false;

		if (banki && banki.env && banki.env.devMode) {
			console.log('dataObj:', dataObj);
			console.log('send form data.');
		}

		dispatch(fetchCheckCreate(dataObj));
	};
}

export function fetchCheckCreate(dataObj) {
	return (dispatch, getState, { api }) => {
		const { form: { eosagoPage } } = getState();

		api.repeat('checkCreate', falseFunc, dataObj)
			.then(({ success, id }) => {
				resultHashref = id;
				if (success === true) {
					if (eosagoPage) {
						const urlSplit = window.location.href.split('/');
						const eosagoHash = urlSplit[urlSplit.length - 2];
						const urlWithoutEosagoHash = window.location.href.split(eosagoHash);
						const newEosagoPageUrl = `${urlWithoutEosagoHash[0]}${resultHashref}/#${Hash.get()}`;
						window.history.pushState(null, '', newEosagoPageUrl);
					}
					dispatch(fetchResult());
				} else if (banki && banki.env && banki.env.devMode) {
					console.warn('Не удалось отправить данные на сервер.');
					dispatch(cancelResult());
				}
			})
			.catch(e => {
				if (banki && banki.env && banki.env.devMode) {
					console.error(e);
				}
				dispatch(setResultStatus(SERVICE_IS_UNAVAILABLE))
			});
	};
}

export function getPaperPolices() {
	return (dispatch, getState, { api }) => {
		api.getPaperPolices(Hash.get())
			.then(({success, result}) => {
				if (success) {
					const { form: { company_id } } = getState();
					const { paperPolicy, allPaperPolicies } = transformPaperPolices(result, company_id);
					dispatch(setPoliciesProps(paperPolicy, allPaperPolicies));
				} else if (banki && banki.env && banki.env.devMode) {
					console.warn('Не удалось получить бумажные полисы.');
				}
			})
			.catch(e => {
				if (banki && banki.env && banki.env.devMode) {
					console.warn('Не удалось отправить данные на сервер.');
				}
			});
	}
}

export function fetchResult() {
	return (dispatch, getState, { api }) => {

		const repeatCondition = (res) => {
			const { form: { isFormSubmitted } } = getState();
			return isFormSubmitted && res.status !== SHOW_RESULTS_TO_EMAIL
		};

		api.repeat('checkResultInfo', repeatCondition, resultHashref)
			.then(({ result, status, errors }) => {
				const { form: { isFormSubmitted } } = getState();

				if (banki && banki.env && banki.env.devMode) {
					console.log('result: ', result);
					console.log('status: ', status);
				}

				dispatch(setPartnerErrors(errors));

				if (!isFormSubmitted) {
					return dispatch({ type: SET_RESULT, params: { result, undefined } });
				}

				let newChosenPolicy = result && result.filter((result) => {
					return result.chosen_by_user === true;
				});
				newChosenPolicy = newChosenPolicy && newChosenPolicy[0];
				const newPrice = newChosenPolicy && newChosenPolicy.premium_sum;
				newPrice && dispatch(setOfferProp('price', newPrice));
				eventEmitter.emit('insurance:e-osago-set-confirmed-results', result);
				dispatch(setDidResultsUpdated(false));

				return dispatch({ type: SET_RESULT, params: { result, status } });
			})
			.catch(e => {
				if (banki && banki.env && banki.env.devMode) {
					console.error('Не удалось получить данные с сервера.', e);
				}
				dispatch(setResultStatus(SERVICE_IS_UNAVAILABLE));
			});
	};
}

export function checkPhoneVerification(verifyDataObj) {
	return (dispatch) => {
		verifyDataObj.phone = clearPhoneNumber(verifyDataObj.phone).slice(2);
		const verifyDataStr = paramObjToStr(verifyDataObj);

		// todo вынести в апи клиента
		fetch(`/insurance/api/eosago/phone-verification/check?${verifyDataStr}`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest'
			},
			credentials: 'same-origin'
		})
		.then(response => response.json())
		.then(data => {
			if (banki && banki.env && banki.env.devMode) {
				console.log(data);
			}
			data.success && data.phone_require && dispatch(verifyPhoneNumber(false));
			(!data.success || !data.phone_require) && dispatch(verifyPhoneNumber(true));
		})
		.catch(e => {
			if (banki && banki.env && banki.env.devMode) {
				console.warn('Не удалось получить данные с сервера.')
			}
		});
	};
}

export function fetchSmsCode(code) {
	return (dispatch, getState) => {

		const dataObj = {
			code
		};
		const dataStr = paramObjToStr(dataObj);

		// todo вынести в апи клиента
		fetch(`/insurance/api/eosago/phone-verification/verify?${dataStr}`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
		.then(response => response.json())
		.then(data => {
			data.valid && dispatch(verifyPhoneNumber(true));
			!data.valid && dispatch(setSmsCodeValid(true));
		})
		.catch(e => {
			if (banki && banki.env && banki.env.devMode) {
				console.warn('Не удалось получить данные с сервера.')
			}
		});
	};
}

export function purchaseStart(checkResultId) {
	return (dispatch, getState, { api }) => {
		const { form: { company_id } } = getState();
		dispatch(setResultStatus(SHOW_LOADING));

		api.purchaseStart(checkResultId)
			.then(({ id, success, agreementId }) => {
				if (company_id === RGS_COMPANY_ID && id) {
					if (success === true) {
						dispatch(setAgreementId(agreementId));
						dispatch(sendSMSCodeRGS());
						dispatch(setPurchaseId(id));
						dispatch(setResultStatus(SHOW_RGS_SMS_AUTH));
					} else {
						dispatch(cancelResult());
						throw 'Не удалось отправить данные на сервер.'
					}
				} else {
					if (success === true && id) {
						dispatch(setPurchaseId(id));
						dispatch(getPaymentUrl());
					} else if (banki && banki.env && banki.env.devMode) {
						dispatch(cancelResult());
						throw 'Не удалось отправить данные на сервер.'
					}
				}
			})
			.catch(e => {
				if (banki && banki.env && banki.env.devMode) {
					console.error(e);
				}
			});
	};
}

export function getPaymentUrl() {
	return (dispatch, getState, { api }) => {
		const { form: { purchaseId } } = getState();
		dispatch(setResultStatus(SHOW_LOADING));

		const repeatCondition = (res) => {
			const { form: { isFormSubmitted } } = getState();
			return isFormSubmitted && !res.success;
		};

		api.repeat('getPaymentUrl', repeatCondition, purchaseId)
			.then(({ status, info }) => {
				if (status !== 0) {
					const _state = getState();
					if (status === SHOW_RESULTS) {
						dispatch(setPaymentUrl({ companyId: _state.form.company_id, paymentUrl: info }));
						dispatch(setResultStatus(SHOW_URL_TO_RESULT))
					} else if (status === SHOW_RESULTS_TO_EMAIL) {
						dispatch(setPaymentUrl({ companyId: _state.form.company_id, paymentUrl: false }));
						dispatch(setResultStatus(SHOW_URL_TO_EMAIL))
					}
				} // todo что иначе то?
			})
			.catch(e => {
				if (banki && banki.env && banki.env.devMode) {
					console.error(e);
				}
				dispatch(setResultStatus(SERVICE_IS_UNAVAILABLE));
			});
	};
}

export function updatePolicyStartDate() {
	return (dispatch, getState) => {
		const {
			car: {
				osago_policy_start_date
			}
		} = getState();

		eventEmitter.emit('insurance:e-osago-update-policy-start-date', osago_policy_start_date);
	}
}

export function setPaymentUrl(params) {
	return { type: SET_PAYMENT_URL, params };
}

export function setDidResultsUpdated(value) {
	return { type: SET_DID_RESULTS, params: {value}};
}

export function setResultStatus(status) {
	return { type: SET_RESULT_STATUS, params: { status } }
}

export function verifyPhoneNumber(value) {
	return { type: VERIFY_PHONE_NUMBER, params: { value } };
}

export const sendSMSCodeRGS = () => (dispatch, getState, { api }) => {
	const { insurant: { phone }, form: { agreementId } } = getState();
	const data = {
		phone: clearPhoneNumber(phone),
		agreementId
	};

	api.rgsSendUrl(data)
		.then(({success}) => {
			if (!success) {
				if (banki && banki.env && banki.env.devMode) {
					console.error('Не удалось отправить код подтверждения на введенный телефон.')
				}
			}
		});
};

export const verifySMSCodeRGS = () => (dispatch, getState, { api }) => {
	const { form: { agreementId }, rgs: { code: { value: code } } } = getState();
	dispatch(setResultStatus(SHOW_LOADING));

	api.rgsVerifyCode(code, agreementId)
		.then(({success}) => {
			if (success) {
				dispatch(getPaymentUrl());
			} else {
				dispatch(setRGSCodeError(RGS_CODE_ERROR_MSG));
				dispatch(setResultStatus(SHOW_RGS_SMS_AUTH));
			}
		})
};

export const setRGSCode = (code) => ({ type: SET_RGS_CODE, params: { code } });
export const setRGSCodeError = (error) => ({ type: SET_RGS_CODE_ERROR, params: { error } });
export const setPurchaseId = (purchaseId) => ({ type: SET_PURCHASE_ID, params: { purchaseId } });
export const setEosagoPage = (value) => ({ type: SET_EOSAGO_PAGE, params: {value}});
