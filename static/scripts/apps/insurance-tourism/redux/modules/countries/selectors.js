import { createSelector } from 'reselect';

export const countryEntitiesSelector = state => state.entities.countries;
export const createCountriesSelector = (countryIds = []) => createSelector(
	countryEntitiesSelector,
	countries => countryIds.map(id => countries[id]),
);
