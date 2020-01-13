'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { formatLocalDateToString } from 'helpers';
import EOsago from '../e-osago/EOsago.jsx';
import store from '../e-osago/store.js';
import { setCarProps, setInsurantProps, setOwnerProps, setDriverProps, setCompanyId, setOfferProps,
	setDefaultProps, setInsurantProp, setPoliciesProps, setEosagoPage } from '../e-osago/actions.js';
import Popup from 'ui.popup';
import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';
import moment from 'moment';
import {
	setAccidentFree,
	setDidResultsUpdated,
	tryToSetSelectedStep,
	addDriver,
	removeDriver,
	setMultidrive,
	setOwnerIsAnInsurant
} from '../e-osago/actions.js';
import { CANCEL_RESULT, SET_RESULT_STATUS, SHOW_URL_TO_RESULT, SHOW_URL_TO_EMAIL, eOSAGOPopupContainerClass, SET_OSAGO_POLICY_START_DATE_MESSAGE } from '../e-osago/constants.js';
import { beautifyPhone, convertTimestampToObj } from '../e-osago/utils.js';
import { getFormValidationStatus, prepareStepItems } from '../e-osago/selectors.js';

const AppRootId = 'checkout-popup';
let popupInstance = null;

export default (params) => {
	popupInstance = new Popup({
		innerContent: `<div id="${AppRootId}" class="${AppRootId}"></div>`,
		width: '620px',
		contentPadding: false,
		hideMobileModeCloseButton: true,
		containerClass: eOSAGOPopupContainerClass,
		closeIconHtml: banki.env.isMobileMode ?
			'<span class="ui-popup__close-icon icon-font icon-close-16 icon-font--size_small" data-click="close-popup" />' :
			'<span class="ui-popup__close-icon icon-font icon-close-24 icon-font--size_medium" data-click="close-popup" />',
		onClose: (popupInstance) => {
			const { result: { status }, form: { selectedStepIndex, didResultsUpdated } } = store.getState();
			if ((status === 2 || status === 'SHOW_URL_TO_RESULT') && selectedStepIndex >= 3 && !didResultsUpdated) {
				eventEmitter.emit('insurance:e-osago-update-auto-results');
			}
			store.dispatch(setDidResultsUpdated(true));
		},
		onBuilded: (popupInstance) => {
			render(<EOsagoCheckout popupInstance={ popupInstance } />, document.getElementById(AppRootId));
		}
	});
}

class EOsagoCheckout extends Component {
	constructor() {
		super();

		this.state = {
			logo: null,
			name: null,
			price: null,
			options: null,
			paperPolicy: null,
			allPaperPolicies: null,
			eosagoPolicies: null,
		};

		this._init = this._init.bind(this);
		this.eosagoPageLoaded = this.eosagoPageLoaded.bind(this);
	}
	componentDidMount() {
		eventEmitter.addListener('insurance:e-osago-checkout', this._init);
		eventEmitter.addListener('insurance:e-osago-checkout-close', this.hidePopup);
		eventEmitter.addListener('insurance:e-osago-reset-form', this.resetForm);
		eventEmitter.addListener('insurance:e-osago-cancel-result', this.cancelResult);
		eventEmitter.addListener('insurance:e-osago-phone-verified', this.onPhoneVerified);
		eventEmitter.addListener('insurance:e-osago-step-changed', this.onStepChange);
		eventEmitter.addListener('insurance:e-osago-page-loaded', this.eosagoPageLoaded);
	}

	_init(user, checkoutData) {
		// Insurance company data
		const { logo, name, price, options, id, kbmStatus, eosagoPolicies } = checkoutData;

		let isDriverExist = false;

		const _state = store.getState();
		const isAlreadyGetPaymentUrl = _state.form && _state.form.paymentUrls && _state.form.paymentUrls.find(item => item.companyId === id);

		!isAlreadyGetPaymentUrl && _state.result && (_state.result.status === SHOW_URL_TO_RESULT || _state.result.status === SHOW_URL_TO_EMAIL) && store.dispatch({ type: SET_RESULT_STATUS, params: { status: 2 } });

		isAlreadyGetPaymentUrl && isAlreadyGetPaymentUrl.paymentUrl && store.dispatch({ type: SET_RESULT_STATUS, params: { status: SHOW_URL_TO_RESULT } });
		isAlreadyGetPaymentUrl && !isAlreadyGetPaymentUrl.paymentUrl && store.dispatch({ type: SET_RESULT_STATUS, params: { status: SHOW_URL_TO_EMAIL } });

		store.dispatch(setCompanyId(id));

		this.setState({ logo, name, price, options, kbmStatus, eosagoPolicies });

		// Offer data
		store.dispatch(setOfferProps({logo, name, price}));

		// For eOSAGO Policies information
		store.dispatch(setPoliciesProps({}, [], eosagoPolicies));

		// Car data
		const fieldsWithId = ['brand', 'model', 'modification'];
		const car = user.car.reduce((result, item) => {
			if (item.code == 'power' && !item.value.match(/^\d{2,4}$/ig)) {
				result[item.code] = item.value.match(/\d{2,4}(?= л\.с\.)/ig)[0];
			} else {
				if (fieldsWithId.includes(item.code)) {
					result[`${item.code}_title`] = item.value;
					result[`${item.code}_id`] = item.id;
				} else {
					result[item.code] = item.value;
				}
			}

			return result;
		}, {});

		car.osago_policy_start_date = this.getPolicyStartSate(user.policy_start_date);
		car.osago_period = user.period;
		if (user.drivers.length && user.drivers[0].vin) {
			car.vin = user.drivers[0].vin.toUpperCase();
		}

		store.dispatch(setCarProps(car));

		const state = store.getState();
		const isInsurant = prepareStepItems(getFormValidationStatus(state), 'formKey')[1].success;
		const isOwner = prepareStepItems(getFormValidationStatus(state), 'formKey')[2].success;

		const { multidrive, accident_free } = user;
		store.dispatch(setAccidentFree(accident_free));
		store.dispatch(setMultidrive(multidrive));
		/** Если не выбрано "Без ограничений" пробрасываем данные о водителях */
		if (!multidrive) {
			/** Уравниваем кол-во водителей в автокалькуляторе и в форме е-ОСАГО */
			if (user.drivers.length > state.drivers.length) {
				while (user.drivers.length > store.getState().drivers.length) {
					store.dispatch(addDriver());
				}
			}
		}

		// User data
		user.drivers.forEach((driver, index) => {
			const {
				firstname,
				lastname,
				surname: patronymic,
				sex: gender,
				license: { series: license_series, number: license_number },
				birthday,
				issue_date: license_issue_date,
				passport
			} = driver;

			let userObj = {};

			if (firstname) { userObj.firstname = firstname; }
			if (lastname) { userObj.lastname = lastname; }
			if (patronymic) { userObj.patronymic = patronymic; }
			if (gender && state.drivers[index] && !state.drivers[index].gender) { userObj.gender = gender; }
			if (birthday) { userObj.birthday = moment(birthday).valueOf(); }
			if (Object.keys(passport).length) {
				userObj.passport_series = passport.series.slice(0, 2) + ' ' + passport.series.slice(2, 4);
				userObj.passport_number = passport.number;
			}

			// Set general data for the insurant and the owner
			if (index === 0) {
				isDriverExist = true;
				if (!isInsurant) {
					store.dispatch(setInsurantProps(userObj));
				}
				if (!isOwner) {
					store.dispatch(setOwnerProps(userObj));
				}
			}

			let driverObj = { ...userObj };

			if (license_series) { driverObj.license_series = license_series; }
			if (license_number) { driverObj.license_number = license_number; }
			if (license_issue_date) { driverObj.date_experience = moment(license_issue_date).valueOf(); }

			// Set data for the first driver
			if (!multidrive) {
				store.dispatch(setDriverProps(index, driverObj));
			}
		});

		/** Проброс данных авторизованного пользователя */
		if (!isDriverExist) {
			const authUser = banki.user;
			const { insurant: { email, phone } } = state;
			if (authUser && !isInsurant) {
				authUser.firstName && store.dispatch(setInsurantProp('firstname', authUser.firstName));
				authUser.lastName && store.dispatch(setInsurantProp('lastname', authUser.lastName));
				authUser.email && !email && store.dispatch(setInsurantProp('email', authUser.email));
				authUser.mobile && !phone && store.dispatch(setInsurantProp('phone', beautifyPhone(authUser.mobile)));
			}
		}

		popupInstance.showPopup();
	}

	eosagoPageLoaded(eosagoData, checkoutData) {
		const { logo, name, price, options, id, kbmStatus, eosagoPolicies } = checkoutData;

		store.dispatch(setEosagoPage(true));
		store.dispatch(setCompanyId(id));
		this.setState({ logo, name, price, options, kbmStatus, eosagoPolicies });
		store.dispatch(setOfferProps({logo, name, price}));
		store.dispatch(setPoliciesProps({}, [], eosagoPolicies));
		eosagoData.car.osago_policy_start_date = this.getPolicyStartSate(eosagoData.osago_policy_start_date);
		store.dispatch(setCarProps(eosagoData.car));
		store.dispatch(setAccidentFree(checkoutData.accident_free));
		store.dispatch(setMultidrive(eosagoData.multidrive));
		store.dispatch(setInsurantProps(eosagoData.insurant));
		if (eosagoData.insurant.phone === eosagoData.owner.phone && eosagoData.insurant.lastname === eosagoData.owner.lastname) {
			store.dispatch(setOwnerIsAnInsurant(true));
		} else {
			store.dispatch(setOwnerIsAnInsurant(false));
			store.dispatch(setOwnerProps(eosagoData.owner));
		}
		store.dispatch(removeDriver(0));
		eosagoData.drivers && eosagoData.drivers.forEach((driver, i) => {
			store.dispatch(addDriver());
			store.dispatch(setDriverProps(i, driver));
		});

		popupInstance.showPopup();
	}

	hidePopup() {
		popupInstance.hidePopup();
	}

	resetForm() {
		store.dispatch(setDefaultProps());
	}

	cancelResult() {
		store.dispatch({ type: CANCEL_RESULT });
		store.dispatch({ type: SET_RESULT_STATUS, params: { status: undefined } });
		store.dispatch(tryToSetSelectedStep(0));
	}

	onPhoneVerified(data) {
		const { insurant: { phone, email, firstname } } = store.getState();
		!firstname && store.dispatch(setInsurantProp('firstname', data.name));
		!email && store.dispatch(setInsurantProp('email', data.email));
		!phone && store.dispatch(setInsurantProp('phone', beautifyPhone(data.phoneNumber)));
	}

	onStepChange() {
		const eOSAGOContainer = document.getElementsByClassName(eOSAGOPopupContainerClass)[0];
		eOSAGOContainer && $(eOSAGOContainer).animate({
			scrollTop: 0
		}, 50);
	}

	getPolicyStartSate(policyStartSate) {
		const osagoPolicyStartDate = new Date(policyStartSate);
		let startDate;
		let dayPlus3 = new Date();
		dayPlus3 = dayPlus3.setDate(dayPlus3.getDate() + 3);
		dayPlus3 = new Date(dayPlus3);
		if (dayPlus3.valueOf() < osagoPolicyStartDate.valueOf()) {
			startDate = osagoPolicyStartDate;
			store.dispatch({ type: SET_OSAGO_POLICY_START_DATE_MESSAGE, params: { value: false } });
		} else {
			startDate = dayPlus3.setDate(dayPlus3.getDate() + 1);
			store.dispatch({ type: SET_OSAGO_POLICY_START_DATE_MESSAGE, params: { value: true } });
		}

		startDate = convertTimestampToObj(startDate);
		startDate = formatLocalDateToString(startDate.year, startDate.month, startDate.day);

		return startDate;
	}

	render() {
		const { logo, price, options, kbmStatus } = this.state;

		return (
			<div className="e-osago-checkout">
				<Provider store={ store }>
					<EOsago
						companyLogo={ logo }
						price={ price }
						leadOptions={ options }
						kbmStatus={ kbmStatus }
						isMobile={ banki.env.isMobileMode }
					/>
				</Provider>
			</div>
		);
	}
}
