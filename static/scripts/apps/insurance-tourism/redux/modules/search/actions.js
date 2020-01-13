import { normalize } from 'normalizr';
import { submit, change } from 'redux-form';
import {
	CALCULATE_POLICIES_REQUEST,
	CALCULATE_POLICIES_SUCCESS,
	CALCULATE_POLICIES_FAILURE,
	SEARCH_POLICIES_REQUEST,
	SEARCH_POLICIES_SUCCESS,
	SEARCH_POLICIES_FAILURE,
	SEARCH_POLICIES_UPDATE,
	UPDATE_SEARCH_PARAMETERS,
	SORT_SELECTED_OPTIONS,
	SEARCH_FORM_NAME,
} from './constants';
import { countryEntitiesSelector } from '../countries';

export function calculatePolicies(values) {
	return {
		types: [CALCULATE_POLICIES_REQUEST, CALCULATE_POLICIES_SUCCESS, CALCULATE_POLICIES_FAILURE],
		promise: api => api.calculatePolicies(values),
	}
}

export function searchPolicies(params, isAjax = true) {
	return {
		type: SEARCH_POLICIES_REQUEST,
		payload: {
			params,
			isAjax,
		},
	};
}

export function searchPoliciesUpdate(payload) {
	return {
		type: SEARCH_POLICIES_UPDATE,
		payload,
	};
}

export function searchPoliciesSuccess(payload) {
	return {
		type: SEARCH_POLICIES_SUCCESS,
		payload,
	};
}

export function searchPoliciesFailure(e) {
	return {
		type: SEARCH_POLICIES_FAILURE,
		payload: e,
	};
}

export function updateSearchParameters(payload) {
	return {
		type: UPDATE_SEARCH_PARAMETERS,
		payload,
	};
}

export function submitSearchForm() {
	return dispatch => dispatch(submit(SEARCH_FORM_NAME));
}

export function sortSelectedOptions(optionsType, selectedOptions) {
	return {
		type: SORT_SELECTED_OPTIONS,
		payload: {
			optionsType,
			selectedOptions,
		},
	};
}

export const selectOptions = value => change(SEARCH_FORM_NAME, 'options', value);
export const selectInsuranceAmount = value => change(SEARCH_FORM_NAME, 'insuranceAmount', value);

/** GA actions */
// VZR-521 событие на изменение страны поездки
export const sendCountryChangeAction = (selectedCountriesIds) => (dispatch, getState) => {
	const countriesEntities = countryEntitiesSelector(getState());
	if (selectedCountriesIds && selectedCountriesIds.length) {
		const selectedCountries = selectedCountriesIds.map(id => countriesEntities[id].enName);
		pushGtmEvent('VZR_SERVIS', 'country', selectedCountries.join(), undefined);
	}
};

export const sendDatesAction = (startDate, endDate) => () => {
	// VZR-522 событие на отправку дат поездки
	if (startDate && endDate) {
		pushGtmEvent('VZR_SERVIS', 'data', `${startDate}_${endDate}`, undefined);
	}
};

export const sendTouristsChangeAction = (tourists) => () => {
	const isAllFilled = tourists.filter(tourist => !tourist.age).length === 0;
	// VZR-523 событие на заполение возраста туристов
	isAllFilled && pushGtmEvent('VZR_SERVIS', 'tourists', `${tourists.length}`, undefined);
};

export function sendVisibleOptionsAction(optionsType, optionDisplayName) {
	// VZR-524 Событие клика на неактивную опцию из трех
	optionsType === 'optionsSubrisk' && pushGtmEvent('VZR_SERVIS', 'click_opcii_zdorovya', optionDisplayName, undefined);
	optionsType === 'optionsSport' && pushGtmEvent('VZR_SERVIS', 'click_sport', optionDisplayName, undefined);
}

export function sendAllOptionsAction(optionsType) {
	// VZR-524 Событие клика на Показать все опции
	optionsType === 'optionsSubrisk' && pushGtmEvent('VZR_SERVIS', 'click_button_vse_opcii_zdorovya', undefined, undefined);
	optionsType === 'optionsSport' && pushGtmEvent('VZR_SERVIS', 'click_button_vse_opcii_sporta', undefined, undefined);
}

export function sendChooseOptionsAction(optionsType) {
	// VZR-524 Событие клика на кнопку Выбрать
	optionsType === 'optionsSubrisk' && pushGtmEvent('VZR_SERVIS', 'click_button_vybrat_opcii_zdorovya', undefined, undefined);
	optionsType === 'optionsSport' && pushGtmEvent('VZR_SERVIS', 'click_button_vybrat_sport', undefined, undefined);
}
