import { PUSH_MODAL, POP_MODAL } from './constants';

const initialState = [];

export default function modalsReducer(state = initialState, action) {
	switch (action.type) {
		case PUSH_MODAL:
			return [
				...state,
				action.payload,
			];
		case POP_MODAL:
			return state.filter(item => item !== action.payload.modal);
		default:
			return state;
	}
}

export * from './actions';
export * from './constants';
