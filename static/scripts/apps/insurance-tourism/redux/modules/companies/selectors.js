import { createSelector } from 'reselect';

export const companyEntitiesSelector = state => state.entities.companies;
export const companySelector = (state, companyId) => state.entities.companies[companyId];
