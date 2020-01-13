import React from 'react';
import { connect } from 'react-redux';

import CarForm from '../components/CarForm.jsx';

import { setPartnerErrors, setCarProp } from '../actions.js';
import { getUsagePeriodsList, getFormValidationResult, getFirstError } from '../selectors.js';

const mapStateToProps = state => {
	const validationResult = getFormValidationResult(state, 'car');

	return {
		data: state.car,
		options: { osago_period: getUsagePeriodsList() },
		errors: getFirstError(validationResult),
		partner_errors: state.form.partner_errors,
	}
};
const mapDispatchToProps = dispatch => {
	return {
		changeHandler: (propName, propValue) => {
			dispatch(setCarProp(propName, propValue))
		},
		setPartnerErrorsHandler: (partner_errors) => {
			dispatch(setPartnerErrors(partner_errors))
		}
	}
};

const CarFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CarForm);

export default CarFormContainer;
