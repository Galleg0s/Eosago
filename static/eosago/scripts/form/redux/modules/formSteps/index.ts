import {
	FormStep,
	FormStepsState,
	RouterAction
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {FormStepsAction} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/formSteps/actions';
import {
	ADD_STEPS,
	DELETE_STEPS
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/formSteps/constants';

const initialState: FormStepsState = {
	steps: [
		FormStep.auto,
		FormStep.autoIdentifier,
		FormStep.autoDocuments,
		FormStep.phoneVerification,
		FormStep.drivers,
		FormStep.ownerGeneral,
		FormStep.ownerPassport,
		FormStep.ownerAddress,
		FormStep.policeDates,
	],
};

export default function formStepsReducer(state = initialState, action: FormStepsAction | RouterAction) {
	switch (action.type) {
		case DELETE_STEPS: {
			let newSteps = [...state.steps];
			action.payload.forEach((step: FormStep) => {
				const indexOfStep = newSteps.indexOf(step);
				if (indexOfStep !== -1) {
					newSteps = [...newSteps.slice(0, indexOfStep), ...newSteps.slice(indexOfStep + 1)];
				} else {
					throw 'Попытка удалить шаг, отсутствующий в state\'е';
				}
			});

			return {
				steps: newSteps,
			};
		}
		case ADD_STEPS:
			return {
				steps: [
					...state.steps.slice(0, action.payload.index),
					...action.payload.step,
					...state.steps.slice(action.payload.index)
				]
			};

		default:
			return {
				...state,
			};
	}
}

export * from './actions';
export * from './constants';
export * from './selectors';
