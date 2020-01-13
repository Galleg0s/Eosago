import {FormState, reducer as formReducer} from 'redux-form'
import {OSAGO_FORM_NAME} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {FormAction} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form/actions';
import {SET_PERSON} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form/constants';
import {PersonType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types/fields';

export default formReducer.plugin({
	[OSAGO_FORM_NAME]: (state: FormState, action: FormAction) => {
		switch (action.type) {
			case SET_PERSON: {
				const {
					person,
					type,
				} = action.payload;
				const currValue = state.values ? state.values[type] : {};
				const currPerson = currValue.person ? currValue.person : {};
				return {
					...state,
					values: {
						...state.values,
						[type]: {
							...currValue,
							person: {
								...currPerson,
								...person,
							}
						}
					}
				};
			}
			default:
				return {
					...state,
				}
		}
	}
});

export * from './actions';
export * from './selectors';
export * from './constants';
