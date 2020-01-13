import {LOCATION_CHANGE} from 'connected-react-router';
import {FormValues} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types/fields';

export interface queryInterface {
	[media: string]: number
}

export interface mediaQueryInterface {
	[media: string]: queryInterface
}

export interface ChangeAction {
	type: string,
	meta: {
		form: string,
		field: string,
	},
	payload: string | number | boolean,
}

export interface SubmitActions {
	type: string,
	payload: FormValues
}

export interface RouterAction {
	type: typeof LOCATION_CHANGE,
	payload: {
		location: {
			pathname: string,
		}
	}
}

export interface FormInitializeAction {
	type: string,
	meta: {
		form: string,
	}
}

export enum IdentifierType {
	vin = 'vin',
	body = 'body_number',
}

export enum AutoDocumentType {
	sts = 'STS',
	pts = 'PTS',
}

export * from './state';
export * from './responses';
export * from './fields';
