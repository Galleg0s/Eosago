import {
	ADD_STEPS,
	DELETE_STEPS,
	GO_TO_NEXT_STEP,
	GO_TO_PREV_STEP
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/formSteps/constants';
import {FormStep} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export type FormStepsAction =
	GoToNextStepAction |
	GoToPrevStepAction |
	DeleteStepsAction |
	AddStepsAction;

/** goToNextStep */
export interface GoToNextStepAction {
	type: GO_TO_NEXT_STEP,
}
export function goToNextStep() {
	return {
		type: GO_TO_NEXT_STEP,
	}
}

/** goToPrevStep */
export interface GoToPrevStepAction {
	type: GO_TO_PREV_STEP,
}
export function goToPrevStep() {
	return {
		type: GO_TO_PREV_STEP,
	};
}

/** deleteStep */
export interface DeleteStepsAction {
	type: DELETE_STEPS,
	payload: Array<FormStep>,
}

export function deleteSteps(payload: Array<FormStep>) {
	return {
		type: DELETE_STEPS,
		payload,
	};
}

/** addStep */
interface AddStepsPayload {
	index: number,
	step: Array<FormStep>,
}


export interface AddStepsAction {
	type: ADD_STEPS,
	payload: AddStepsPayload,
}

export function addSteps(index: number, steps: Array<FormStep>) {
	return {
		type: ADD_STEPS,
		payload: {
			index: index,
			step: steps
		},
	};
}
