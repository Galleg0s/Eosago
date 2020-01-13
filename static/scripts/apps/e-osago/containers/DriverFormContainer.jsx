import React, { Component } from 'react';
import { connect } from 'react-redux';

import DriverForm from '../components/DriverForm.jsx';

import { setDriverProp } from '../actions';
import { getFormValidationResult, getFirstError } from '../selectors.js';

const mapStateToProps = (state, ownProps) => {
	// const validationResult = getFormValidationResult(state, 'drivers');

	return {
		data: state.drivers[ownProps.index],
		// errors: getFirstError(validationResult)
	}
};
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		changeHandler: (propName, propValue) => {
			dispatch(setDriverProp(ownProps.index, {[propName]: propValue}))
		}
	}
};

const DriverFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DriverForm);

export default DriverFormContainer;
