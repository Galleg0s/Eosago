const SET_RUNTIME_VARIABLE = 'ins/runtime/SET_RUNTIME_VARIABLE';

export default function runtimeReducer(state = {}, action) {
	switch (action.type) {
		case SET_RUNTIME_VARIABLE:
			return {
				...state,
				[action.payload.key]: action.payload.value,
			};
		default:
			return state;
	}
}

export function setRuntimeVariable(key, value) {
	return {
		type: SET_RUNTIME_VARIABLE,
		payload: { key, value },
	};
}

export * from './selectors';
