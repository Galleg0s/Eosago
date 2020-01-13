import {
	PUSH_MODAL,
	POP_MODAL,
	MODAL_TYPE_GUARANTEED_OPTIONS,
	MODAL_TYPE_CONFIRM_SUBSCRIBE,
	MODAL_TYPE_CONFIRM_TERMS,
} from './constants';

export function pushModal(type, props = {}) {
	return {
		type: PUSH_MODAL,
		payload: {
			type,
			props,
		},
	}
}

export function popModal(modal) {
	return {
		type: POP_MODAL,
		payload: {
			modal,
		},
	};
}

export function showGuaranteedOptionsModal() {
	return pushModal(MODAL_TYPE_GUARANTEED_OPTIONS);
}

export function showConfirmSubscribeModal() {
	return pushModal(MODAL_TYPE_CONFIRM_SUBSCRIBE);
}

export function showConfirmTermsModal(company) {
	return pushModal(MODAL_TYPE_CONFIRM_TERMS, { company });
}
