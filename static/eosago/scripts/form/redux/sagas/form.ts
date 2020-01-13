import {change} from 'redux-form';
import {call, getContext, put, select, takeLatest} from 'redux-saga/effects';
import {
	codeSendRequest,
	phoneSendRequest
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/phoneVerification';
import {
	addSteps,
	deleteSteps,
	stepsSelector
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/formSteps';
import {
	AutoFormFieldNames,
	ChangeAction, FormStep,
	PersonFieldNames,
	PersonType,
	PhoneVerificationFieldNames,
	PassportFieldNames,
	SubmitActions
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	CHANGE,
	currentYear,
	INSURANT_STEPS,
	OSAGO_FORM_NAME,
	PHONE_LENGTH,
	PREVIOUS_CENTURY_FIRST_YEAR,
	VERIFICATION_CODE_LENGTH,
	PASSPORT
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {sendForm} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form';
import {serializeFormData} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';
import ApiClient from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/api';
import {
	brandsSelector,
	modelsSelector
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/autoCatalog';
import {getResultInfo, setRequestStatus, setResultInfoRequestStatus} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/actions';
import {push} from 'connected-react-router';
import Url from 'utils.url';
import {Paths} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/paths';
import { REQUEST_STATUS } from '../modules/results/constants';


function* formChangeHandler({meta: {form, field}, payload}: ChangeAction) {
	const YEARS_BETWEEN_CURRENT_AND_PRODUCTION = 3;
	if (form === OSAGO_FORM_NAME) {
		if (field === PhoneVerificationFieldNames.phone) {
			if ((<string>payload).length === PHONE_LENGTH) {
				yield put(phoneSendRequest());
			}
		}
		if (field === PhoneVerificationFieldNames.code) {
			if ((<string>payload).length === VERIFICATION_CODE_LENGTH) {
				yield put(codeSendRequest());
			}
		}
		if (field === AutoFormFieldNames.year) {
			const carProductionYear: number = parseInt(<string>payload);
			const isCorrectCarProductionInput = carProductionYear > PREVIOUS_CENTURY_FIRST_YEAR && carProductionYear <= currentYear;

			const formStepsInState: Array<FormStep> = yield select(stepsSelector);
			const diagnosticCardStep = FormStep.diagnosticCard;

			const isCorrectDifferenceInYears = currentYear - carProductionYear >= YEARS_BETWEEN_CURRENT_AND_PRODUCTION;
			const dcStepPositionInState = formStepsInState.indexOf(diagnosticCardStep);
			const isStepInState = dcStepPositionInState !== -1;
			const DC_STEP_POSITION = formStepsInState.length;

			if (isCorrectCarProductionInput && isCorrectDifferenceInYears) {
				if (!isStepInState) {
					yield put(addSteps(DC_STEP_POSITION, [diagnosticCardStep]));
				}
			} else if (isStepInState) {
				yield put(deleteSteps([FormStep.diagnosticCard]));
			}
		}
		if (field === AutoFormFieldNames.brand) {
			yield put(change(OSAGO_FORM_NAME, AutoFormFieldNames.model, null));
		}
		if (field === `${PersonType.owner}.person.${PersonFieldNames.isInsurant}`) {
			if (payload === true) {
				yield put(deleteSteps(INSURANT_STEPS));
			} else {
				const formStepsInState: Array<FormStep> = yield select(stepsSelector);
				const lastOwnerStep = formStepsInState.indexOf(FormStep.ownerAddress);
				yield put(addSteps(lastOwnerStep + 1, INSURANT_STEPS));
			}
		}
		if (
			field.includes(`passport.${PassportFieldNames.emitentCode}`)
			&& typeof payload === 'string'
			&& payload.length === PASSPORT.EMITENT_CODE_LENGTH
		) {
			const api: ApiClient = yield getContext('api');
			try {
				const { data: { branchCode }} = yield call(api.getPassportBranch, payload);
				yield put(change(OSAGO_FORM_NAME, field.replace(PassportFieldNames.emitentCode, PassportFieldNames.emitent), branchCode));
			} catch (error) {
				console.warn(error);
			}
		}
	}
}

function* formSubmitHandler(action: SubmitActions) {
	const api: ApiClient = yield getContext('api');
	const brands = yield select(brandsSelector);
	const models = yield select(modelsSelector);
	const data = serializeFormData(action.payload, brands, models);

	// При передаче поля version расчёт ЕОСАГО осуществляется через ЛКА
	// Без этого параметра - через страховую. Но в связи с тем, что справочники АВТО отличаются и нет маппингов, от
	// СК в этом случае мы не получим ни одного подтверждения.
	const versionedData = { version: 2, ...data };

	try {
		yield put(setResultInfoRequestStatus(REQUEST_STATUS.PENDING));
		const { id, success, message } = yield call(api.checkCreate, versionedData);
		if (success) {
			yield put(getResultInfo(id));
			yield put(push(Url(`${ Paths.results }`).addParams({ id: encodeURIComponent(id) }).getPath()));
		} else {
			yield put(sendForm.failure(message))
		}
	} catch (e) {
		yield put(sendForm.failure(e))
	}
}

export default function* formSaga() {
	yield takeLatest(CHANGE, formChangeHandler);
	yield takeLatest(sendForm.REQUEST, formSubmitHandler);
}
