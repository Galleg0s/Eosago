import React, { Component } from 'react';
import { connect } from 'react-redux';

import Steps from '../components/Steps.jsx';

import { tryToSetSelectedStep } from '../actions.js';
import { prepareStepItems, getFormValidationStatus } from '../selectors.js';

const mapStateToProps = state => {
	const formValidationStatus = getFormValidationStatus(state);

	return {
		items: prepareStepItems(formValidationStatus, 'formKey'),
		selected: state.form.selectedStepIndex
	}
};
const mapDispatchToProps = dispatch => {
	return {
		onClickHandler: (index) => {
			dispatch(tryToSetSelectedStep(index))
		}
	}
};

const StepsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Steps);

export default StepsContainer;
