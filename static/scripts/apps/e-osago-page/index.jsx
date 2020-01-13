import React from 'react';
import ReactDOM from 'react-dom';
import CarStore from '../auto/stores/car-store.js';
import UserStore from '../auto/stores/user-store.js';
import ResultStore from '../auto/stores/result-store.js';
import SeoStore from '../auto/stores/seo-store.js';
import PopupStore from '../auto/stores/popup-store.js';
import API from '../auto/utils/api.js';
import AutoForm from '../auto/components/form.jsx';
import CarWidget from '../auto/components/car-widget.jsx';
import LeadPopup from '../auto/components/lead-popup.jsx';
import ProgressWidget from '../auto/components/progress-widget.jsx';
import TipsWidget from '../auto/components/tips-widget.jsx';
import ExplanationWidget from '../auto/components/explanation-widget.jsx';
import Result from '../auto/components/result.jsx';
import { beautifyPhone } from '../e-osago/utils.js';

const carWidgetPopupId = PopupStore.getPopupIdAttribute('carWidgetPopup');
const progressWidgetPopupId = PopupStore.getPopupIdAttribute('progressWidgetPopup');
const carWidgetElement = document.getElementById(carWidgetPopupId);
const leadPopupElement = document.getElementById(PopupStore.getPopupIdAttribute('leadPopup'));
const progressWidgetElement = document.getElementById(progressWidgetPopupId);

import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';
import ApiClient from './api';

const eosagoAPI = new ApiClient();

export default params => {
	function render() {
		ReactDOM.render(<AutoForm />, params.formElement);
		ReactDOM.render(<CarWidget />, carWidgetElement);
		ReactDOM.render(<LeadPopup />, leadPopupElement);
		ReactDOM.render(<ProgressWidget />, progressWidgetElement);

		if (params.tipsWidgetElement) {
			ReactDOM.render(<TipsWidget />, params.tipsWidgetElement);
		}

		ReactDOM.render(<Result />, params.resultElement);

		if (params.explanationWidgetElement) {
			ReactDOM.render(<ExplanationWidget />, params.explanationWidgetElement);
		}
	}

	eosagoAPI.eosagoCheck(params.hashRef)
		.then(eosagoCheckData => {
			eosagoAPI.getPaperPolices(eosagoCheckData.calculate)
				.then(calculateData => {
					banki && banki.env && banki.env.devMode && console.log(eosagoCheckData, calculateData);

					SeoStore.setSeoData();
					UserStore.setConfigData();
					API.getCarBrands(function(brands) {
						CarStore.setCarBrands(brands);

						if (eosagoCheckData.calculate) {
							ResultStore.calculate(eosagoCheckData.calculate, null, function() {
								render();
								showEosagoPopup(eosagoCheckData, calculateData);
							});
						} else {
							render();
							showEosagoPopup(eosagoCheckData, calculateData);
						}
					});
				})
				.catch(error => {
					if (banki && banki.env && banki.env.devMode) {
						console.warn('Не удалось получить данные с сервера.');
						console.log(error && error.message);
					}
				});
		})
		.catch(error => {
			if (banki && banki.env && banki.env.devMode) {
				console.warn('Не удалось получить данные с сервера.');
				console.log(error && error.message);
			}
		});
}

function showEosagoPopup(eosagoCheckData, calculateData) {
	let checkoutData = {};
	let eosagoData = {};

	const eosagoPolicies = calculateData.result['5']; // 5 - еОСАГО
	const policyBySelectedCompany = eosagoPolicies.find(policy => policy.company.id === eosagoCheckData.company_id);
	const policy = policyBySelectedCompany || eosagoPolicies[0];

	if (policy) {
		checkoutData.logo = policy.company.logo;
		checkoutData.name = policy.company.name;
		checkoutData.options = policy.products.osago.options;
		checkoutData.price = policy.products.osago.price;
	}

	checkoutData.id = eosagoCheckData.company_id;
	checkoutData.kbmStatus = calculateData.kbmStatus;
	checkoutData.accident_free = calculateData.data.accident_free;

	eosagoData.car = {
		brand_title: eosagoCheckData.car.brand.value,
		brand_id: eosagoCheckData.car.brand.id,
		mileage: eosagoCheckData.car.mileage,
		model_title: eosagoCheckData.car.model.value,
		model_id: eosagoCheckData.car.model.id,
		modification_title: eosagoCheckData.car.modification.value,
		modification_id: eosagoCheckData.car.modification.id,
		power: eosagoCheckData.car.power,
		year: eosagoCheckData.car.year,
		has_trailer: eosagoCheckData.car.has_trailer || false,
		used_as_taxi: eosagoCheckData.car.used_as_taxi || false,
		body_number: eosagoCheckData.car.body_number,
		vin: eosagoCheckData.car.vin,
		identifier: eosagoCheckData.car.body_number ? 'body_number' : 'vin',
		license_plate: eosagoCheckData.car.license_plate && eosagoCheckData.car.license_plate.replace(/(.){6}/g, '$& '),
		registration_passport: `${eosagoCheckData.car.vehicle_document.series.replace(/(.){2}/g, '$& ')}${eosagoCheckData.car.vehicle_document.number}`,
		registration_passport_type: eosagoCheckData.car.vehicle_document.type,
		registration_passport_date: (new Date(eosagoCheckData.car.vehicle_document.issue_date)).valueOf(),
		diagnostic_card: eosagoCheckData.car.diagnostic_card_number,
		diagnostic_card_date_end: eosagoCheckData.car.diagnostic_card_date_end ?
			(new Date(eosagoCheckData.car.diagnostic_card_date_end)).valueOf() : null,
	};

	eosagoData.multidrive = eosagoCheckData.multidrive;
	eosagoData.osago_policy_start_date = eosagoCheckData.osago_policy_start_date;
	eosagoData.car.osago_period = eosagoCheckData.osago_period;

	eosagoData.insurant = {
		lastname: eosagoCheckData.insurant.last_name,
		firstname: eosagoCheckData.insurant.first_name,
		patronymic: eosagoCheckData.insurant.patronymic,
		gender: eosagoCheckData.insurant.sex,
		phone: eosagoCheckData.insurant.phone && beautifyPhone(eosagoCheckData.insurant.phone),
		email: eosagoCheckData.insurant.email,
		birthday: (new Date(eosagoCheckData.insurant.birthday)).valueOf(),
		passport_series: eosagoCheckData.insurant.passport.series.replace(/(\d)(?=(\d{2})+(\D|$))/g, '$1 '),
		passport_number: eosagoCheckData.insurant.passport.number,
		passport_issue_date: (new Date(eosagoCheckData.insurant.passport.issue_date)).valueOf(),
		passport_emitent: eosagoCheckData.insurant.passport.issued_by,
		registration_region: eosagoCheckData.insurant.address_registration.region,
		registration_region_kladr_id: eosagoCheckData.insurant.address_registration.region_code_kladr,
		registration_city: eosagoCheckData.insurant.address_registration.city,
		registration_city_kladr_id: eosagoCheckData.insurant.address_registration.city_code_kladr,
		registration_settlement: eosagoCheckData.insurant.address_registration.settlement,
		registration_settlement_kladr_id: eosagoCheckData.insurant.address_registration.settlement_code_kladr,
		registration_area: eosagoCheckData.insurant.address_registration.area,
		registration_area_kladr_id: eosagoCheckData.insurant.address_registration.area_code_kladr,
		registration_street: eosagoCheckData.insurant.address_registration.street,
		registration_street_kladr_id: eosagoCheckData.insurant.address_registration.street_code_kladr,
		registration_house: eosagoCheckData.insurant.address_registration.house,
		registration_flat: eosagoCheckData.insurant.address_registration.flat && eosagoCheckData.insurant.address_registration.flat.toString(),
		registration_postcode: eosagoCheckData.insurant.address_registration.postcode.toString(),
	};

	eosagoData.owner = {
		lastname: eosagoCheckData.owner.last_name,
		firstname: eosagoCheckData.owner.first_name,
		patronymic: eosagoCheckData.owner.patronymic,
		gender: eosagoCheckData.owner.sex,
		phone: eosagoCheckData.owner.phone && beautifyPhone(eosagoCheckData.owner.phone),
		email: eosagoCheckData.owner.email,
		birthday: (new Date(eosagoCheckData.owner.birthday)).valueOf(),
		passport_series: eosagoCheckData.owner.passport.series.replace(/(\d)(?=(\d{2})+(\D|$))/g, '$1 '),
		passport_number: eosagoCheckData.owner.passport.number,
		passport_issue_date: (new Date(eosagoCheckData.owner.passport.issue_date)).valueOf(),
		passport_emitent: eosagoCheckData.owner.passport.issued_by,
		registration_region: eosagoCheckData.owner.address_registration.region,
		registration_region_kladr_id: eosagoCheckData.owner.address_registration.region_code_kladr,
		registration_city: eosagoCheckData.owner.address_registration.city,
		registration_city_kladr_id: eosagoCheckData.owner.address_registration.city_code_kladr,
		registration_settlement: eosagoCheckData.owner.address_registration.settlement,
		registration_settlement_kladr_id: eosagoCheckData.owner.address_registration.settlement_code_kladr,
		registration_area: eosagoCheckData.owner.address_registration.area,
		registration_area_kladr_id: eosagoCheckData.owner.address_registration.area_code_kladr,
		registration_street: eosagoCheckData.owner.address_registration.street,
		registration_street_kladr_id: eosagoCheckData.owner.address_registration.street_code_kladr,
		registration_house: eosagoCheckData.owner.address_registration.house,
		registration_flat: eosagoCheckData.owner.address_registration.flat && eosagoCheckData.owner.address_registration.flat.toString(),
		registration_postcode: eosagoCheckData.owner.address_registration.postcode.toString(),
	};

	eosagoData.drivers = eosagoCheckData.drivers !== 'multidrive' && eosagoCheckData.drivers.map(driver => {
		return {
			lastname: driver.last_name,
			firstname: driver.first_name,
			patronymic: driver.patronymic,
			birthday: (new Date(driver.birthday)).valueOf(),
			license_series: driver.license.series,
			license_number: driver.license.number,
			date_experience: (new Date(driver.license.first_issue_date)).valueOf(),
			gender: driver.sex,
		}
	});

	eventEmitter.emit('insurance:e-osago-page-loaded', eosagoData, checkoutData);
}
