import {
	TOGGLE_AGREEMENT_MODAL,
	TOGGLE_SUBSCRIBE_MODAL
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/modals/constatnts';
import {ModalsAction} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/modals/actions';

const initialState = {
	isAgreementModalVisible: false,
	isSubscribeModalVisible: false,
};

export default function modalsReducer(state = initialState, action: ModalsAction) {
	switch (action.type) {
		case TOGGLE_AGREEMENT_MODAL:
			return {
				...state,
				isAgreementModalVisible: !state.isAgreementModalVisible,
			};
		case TOGGLE_SUBSCRIBE_MODAL:
			return {
				...state,
				isSubscribeModalVisible: !state.isSubscribeModalVisible,
			};
		default:
			return {
				...state,
			}
	}
}

export * from './constatnts';
export * from './actions';
export * from './selectors';
