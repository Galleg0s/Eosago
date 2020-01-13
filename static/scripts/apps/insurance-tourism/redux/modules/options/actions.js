import { normalize } from 'normalizr';
import {
	FETCH_OPTIONS_SUBRISK_REQUEST,
	FETCH_OPTIONS_SUBRISK_SUCCESS,
	FETCH_OPTIONS_SUBRISK_FAILURE,
	FETCH_OPTIONS_SPORT_REQUEST,
	FETCH_OPTIONS_SPORT_SUCCESS,
	FETCH_OPTIONS_SPORT_FAILURE,
} from './constants';
import { optionSchema } from './schemas';

export function fetchOptionsSubrisk() {
	return {
		types: [FETCH_OPTIONS_SUBRISK_REQUEST, FETCH_OPTIONS_SUBRISK_SUCCESS, FETCH_OPTIONS_SUBRISK_FAILURE],
		promise: api => api.fetchOptionsSubrisk()
			.then(data => normalize(data.payload, [optionSchema]))
	};
}

export function fetchOptionsSport(countryId, startDate) {
	return {
		types: [FETCH_OPTIONS_SPORT_REQUEST, FETCH_OPTIONS_SPORT_SUCCESS, FETCH_OPTIONS_SPORT_FAILURE],
		promise: api => api.fetchOptionsSport(countryId, startDate)
			.then(data => normalize(data.payload, [optionSchema])),
	};
}
