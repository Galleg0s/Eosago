import { createSelector } from 'reselect';
import { formValueSelector, change } from 'redux-form';
import { SEARCH_FORM_NAME } from './constants';
import { createCountriesSelector } from '../countries';
import { resultEntitiesSelector } from '../results';
import { optionEntitiesSelector } from '../options';

const searchResultsArraySelector = state => state.search.searchResults;

export const isSearchingSelector = state => state.search.isSearching;
export const searchProgressSelector = state => state.search.searchProgress;
export const submitUrlSelector = state => state.search.submitUrl;

export const popularCountriesSelector = state => createCountriesSelector(state.search.popularCountries)(state);
export const otherCountriesSelector = state => createCountriesSelector(state.search.otherCountries)(state);

export const createOptionsSelector = optionsType => createSelector(
	state => state.search[optionsType],
	optionEntitiesSelector,
	(optionIds, options) => optionIds.map(id => options[id]),
);

export const searchResultsSelector = createSelector(
	searchResultsArraySelector,
	resultEntitiesSelector,
	(results, resultEntities) => results.map(id => resultEntities[id]),
);

export const searchParametersSelector = state => state.search.params;

export const searchFormValuesSelector = formValueSelector(SEARCH_FORM_NAME);
