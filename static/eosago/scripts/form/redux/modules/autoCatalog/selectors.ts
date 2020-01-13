import {State} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export const brandsSelector = (state: State) => state.autoCatalog.brands;
export const isBrandsLoadingSelector = (state: State) => state.autoCatalog.isBrandsLoading;
export const modelsSelector = (state: State) => state.autoCatalog.models;
export const isModelsLoadindSelector = (state: State) => state.autoCatalog.isModelsLoading;
