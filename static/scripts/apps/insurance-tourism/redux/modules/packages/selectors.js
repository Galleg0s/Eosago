import { createSelector } from 'reselect';

export const packageEntitiesSelector = state => state.entities.packages;
export const packageSelector = (state, packageId) => state.entities.packages[packageId];
