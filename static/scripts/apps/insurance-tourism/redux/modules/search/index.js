import {
	SEARCH_POLICIES_REQUEST,
	SEARCH_POLICIES_SUCCESS,
	SEARCH_POLICIES_FAILURE,
	SEARCH_POLICIES_UPDATE,
	UPDATE_SEARCH_PARAMETERS,
	SORT_SELECTED_OPTIONS,
} from './constants';

import {
	FETCH_COUNTRIES_REQUEST,
	FETCH_COUNTRIES_SUCCESS,
	FETCH_COUNTRIES_FAILURE,
} from '../countries';

import {
	FETCH_OPTIONS_SUBRISK_REQUEST,
	FETCH_OPTIONS_SUBRISK_SUCCESS,
	FETCH_OPTIONS_SUBRISK_FAILURE,
	FETCH_OPTIONS_SPORT_REQUEST,
	FETCH_OPTIONS_SPORT_SUCCESS,
	FETCH_OPTIONS_SPORT_FAILURE,
} from '../options';

const initialState = {
	selectedCountries: [],
	selectedOptions: [],
	popularCountries: [],
	otherCountries: [],
	searchResults: [],
	optionsSubrisk: [],
	optionsSport: [],
	isCountriesLoading: true,
	isSearching: false,
	searchProgress: 0,
	params: {
		dates: {},
		yearPolicy: false,
		tourists: [
			{ age: null },
		],
		countries: [],
		options: [],
		currency: 'EUR',
	},
};

function sortSelectedOptions(options, selectedOptions) {
	return options
		.map(item => item)
		.sort((a, b) => {
			const aSelected = selectedOptions.includes(a);
			const bSelected = selectedOptions.includes(b);
			if (aSelected === bSelected) {
				return options.indexOf(a) - options.indexOf(b)
			}
			return bSelected - aSelected;
		});
}

export default function searchReducer(state = initialState, action) {
	if (!state.hydrated) {
		state = {
			...initialState,
			...state,
			params: {
				...initialState.params,
				...state.params,
			},
			hydrated: true
		};
	}

	switch (action.type) {
		case SEARCH_POLICIES_REQUEST:
			return {
				...state,
				searchProgress: 0,
				isSearching: true,
			};
		case SEARCH_POLICIES_SUCCESS:
			return {
				...state,
				isSearching: false,
				searchResults: action.payload.result,
			};
		case SEARCH_POLICIES_FAILURE:
			return {
				...state,
				isSearching: false,
			};
		case SEARCH_POLICIES_UPDATE:
			return {
				...state,
				searchProgress: action.payload.searchProgress,
				isSearching: true,
			};
		case FETCH_COUNTRIES_REQUEST:
			return {
				...state,
				isCountriesLoading: true,
			};
		case FETCH_COUNTRIES_SUCCESS: {
			const { popular, other } = action.payload.result;
			return {
				...state,
				isCountriesLoading: false,
				popularCountries: popular,
				otherCountries: other,
			};
		}
		case FETCH_COUNTRIES_FAILURE:
			return {
				...state,
				isCountriesLoading: false,
			};
		case FETCH_OPTIONS_SUBRISK_SUCCESS:
			return {
				...state,
				optionsSubrisk: sortSelectedOptions(action.payload.result, state.params.options),
			};
		case FETCH_OPTIONS_SPORT_SUCCESS:
			return {
				...state,
				optionsSport: sortSelectedOptions(action.payload.result, state.params.options),
			};
		case UPDATE_SEARCH_PARAMETERS:
			return {
				...state,
				params: {
					...state.params,
					...action.payload,
				},
			};
		case SORT_SELECTED_OPTIONS: {
			const { optionsType, selectedOptions } = action.payload;
			return {
				...state,
				[optionsType]: sortSelectedOptions(state[optionsType], selectedOptions),
			};
		}
		default:
			return state;
	}
}

export * from './constants';
export * from './actions';
export * from './selectors';
