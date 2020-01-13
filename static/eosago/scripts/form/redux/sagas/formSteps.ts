import { call, put, select, takeLatest } from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {FormStep, State} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {Paths} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/paths';
import {
	GO_TO_NEXT_STEP,
	GO_TO_PREV_STEP
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/formSteps';
import { SCROLL_ANCHOR_ID, SCROLL_DELAY } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';

function scrollToAnchorEffect() {
	const anchor = document.getElementById(SCROLL_ANCHOR_ID);
	if (anchor) {
		setTimeout(() => {
			anchor.scrollIntoView({ block: 'start', behavior: 'smooth' });
		}, SCROLL_DELAY);
	}
}

function getNextStep(currentStep: FormStep, steps: Array<FormStep>) {
	const currentIndex = steps.findIndex((el: FormStep) => {
		return el === currentStep;
	});
	if (currentIndex !== -1) {
		const stepsCount = steps.length;
		if (currentIndex + 1 >= stepsCount) {
			return currentStep;
		} else {
			return steps[currentIndex + 1];
		}
	}/* else {*/
	// подумать
	// }
}

function getPrevStep(currentStep: FormStep, steps: Array<FormStep>) {
	const currentIndex = steps.findIndex((el: FormStep) => {
		return el === currentStep;
	});
	if (currentIndex !== -1) {
		if (currentIndex === 0) {
			return currentStep;
		} else {
			return steps[currentIndex - 1];
		}
	}/* else {*/
	// подумать
	// }
}

function goToStepHandler(isBack: boolean = false) {
	return function* () {
		const state: State = yield select();
		const {
			formSteps: {
				steps,
			},
			router: {
				location: {
					pathname,
				}
			}
		} = state;
		const currentStepIndex = steps.findIndex(((el: FormStep) => `${Paths.form}${ el }` === pathname));
		if (!isBack && (currentStepIndex + 1 >= steps.length)) {
			yield put(push(`${ Paths.results }`));
		} else {
			const currentStep = <FormStep>pathname.replace(Paths.form, '');
			const nextStep = !isBack ? getNextStep(currentStep, steps) :
				getPrevStep(currentStep, steps);
			yield put(push(`${Paths.form}${ nextStep }`));
		}
		yield call(scrollToAnchorEffect);
	}
}

export default function* formStepsSaga() {
	yield takeLatest(GO_TO_NEXT_STEP, goToStepHandler());
	yield takeLatest(GO_TO_PREV_STEP, goToStepHandler(true));
}
