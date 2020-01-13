import { normalize } from 'normalizr';
import {
	FETCH_COUNTRIES_REQUEST,
	FETCH_COUNTRIES_SUCCESS,
	FETCH_COUNTRIES_FAILURE,
} from './constants';
import { countrySchema, countriesSchema } from './schemas';

function sortCountries(accumulator, currentValue) {
	const type = currentValue.popular ? 'popular' : 'other';
	if (!accumulator[type]) {
		accumulator[type] = [];
	}
	accumulator[type].push(currentValue);
	return accumulator;
}

export function fetchCountries() {
	return {
		types: [FETCH_COUNTRIES_REQUEST, FETCH_COUNTRIES_SUCCESS, FETCH_COUNTRIES_FAILURE],
		promise: api => api.fetchCountries()
			.then(data => data.payload.reduce(sortCountries, {})) // сортируем страны по популярности
			.then(sorted => normalize(sorted, { popular: [countrySchema], other: [countrySchema] })),
	};
}
