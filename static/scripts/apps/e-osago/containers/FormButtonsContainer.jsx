import React, { Component } from 'react';
import { connect } from 'react-redux';

import FormButtons from '../components/FormButtons.jsx';
import { tryToSetSelectedStep, sendFormData, updatePolicyStartDate, getPaperPolices } from '../actions.js';
import { isFormValid, getStepsCount, prepareStepItems, getFormValidationStatus } from '../selectors.js';

const mapStateToProps = state => {
	const formValidationStatus = getFormValidationStatus(state);
	const processedSteps = prepareStepItems(formValidationStatus, 'formKey');
	const formIsValid = isFormValid(formValidationStatus);
	const step = state.form.selectedStepIndex;
	const isPhoneVerified = state.form.isPhoneVerified;

	return {
		currentStepIndex: step,
		isPrevVisible: step > 0,
		isNextVisible: step < getStepsCount() - 1,
		isSubmitVisible: step === getStepsCount() - 1,
		isPrevAvailable: step > 0,
		isNextAvailable: step < getStepsCount() - 1 && processedSteps[step].success,
		isSubmitAvailable: formIsValid,
		isPhoneVerified: isPhoneVerified
	}
};
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		prevHandler: (index) => {
			dispatch(tryToSetSelectedStep(index - 1))
		},
		nextHandler: (index) => {
			dispatch(tryToSetSelectedStep(index + 1))
		},
		submitHandler: () => {
			// dispatch(getPaperPolices());
			dispatch(sendFormData());
			dispatch(updatePolicyStartDate());
		},
	}
};

const FormButtonsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormButtons);

export default FormButtonsContainer;
