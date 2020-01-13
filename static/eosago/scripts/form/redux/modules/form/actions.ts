import { createFormAction } from 'redux-form-saga';
import {PersonType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {SuggestedPerson} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Person/Person';
import {SET_PERSON} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form/constants';

export type FormAction = SetPerson;

export interface SetPerson {
	type: SET_PERSON,
	payload: {
		person: SuggestedPerson,
		type: PersonType,
	}
}

export function setPerson(person: SuggestedPerson, type: PersonType) {
	return {
		type: SET_PERSON,
		payload: {
			person,
			type,
		}
	}
}

export const sendForm = createFormAction('ins/eosago/SEND_FORM');
