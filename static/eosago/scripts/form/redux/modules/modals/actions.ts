import {
	TOGGLE_AGREEMENT_MODAL,
	TOGGLE_SUBSCRIBE_MODAL
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/modals/constatnts';

export type ModalsAction = ToggleAgreementModal | ToggleSubscribeModal;

export interface ToggleAgreementModal {
	type: TOGGLE_AGREEMENT_MODAL,
}
export function toggleAgreementModal() {
	return {
		type: TOGGLE_AGREEMENT_MODAL,
	}
}

export interface ToggleSubscribeModal {
	type: TOGGLE_SUBSCRIBE_MODAL,
}
export function toggleSubscribeModal() {
	return {
		type: TOGGLE_SUBSCRIBE_MODAL,
	}
}
