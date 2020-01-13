import React, { Component } from 'react';
import { connect } from 'react-redux';

import DriversForm from '../components/DriversForm.jsx';

import { addDriver, removeDriver, setDriverProp, setPartnerErrors } from '../actions.js';
import { getFormArrayValidationResult, getFirstError } from '../selectors.js';

const mapStateToProps = state => {
	const validationResult = getFormArrayValidationResult(state, 'drivers');

	return {
		drivers: state.drivers,
		errors: validationResult.map(result => getFirstError(result)),
		partner_errors: state.form.partner_errors,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		addDriverHandler: () => {
			dispatch(addDriver())
		},
		removeDriverHandler: (index) => {
			dispatch(removeDriver(index))
		},
		changeHandler: (index, propName, propValue) => {
			dispatch(setDriverProp(index, propName, propValue))
		},
		setPartnerErrorsHandler: (partner_errors) => {
			dispatch(setPartnerErrors(partner_errors))
		}
	}
};

const DriversFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DriversForm);

export default DriversFormContainer;
