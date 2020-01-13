import { State, FormValues } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import { selector } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form';

export const driversSelector = (state: State) => selector(state, <keyof FormValues>'drivers');
export const driversIsNoRestrictionSelector = (state: State) => selector(state, <keyof FormValues>'driversIsNoRestriction');
