import React, { Component } from 'react';
import { connect } from 'react-redux';

import PopupHeader from '../components/PopupHeader.jsx';
import { setCarProp, setPartnerErrors } from '../actions.js';

const mapStateToProps = state => {
	return {
		period: state.car.osago_period,
		policyStartDate: state.car.osago_policy_start_date,
		policyStartDateMessage: state.form.osago_policy_start_date_message,
		isFormSubmitted: state.form.isFormSubmitted,
		partner_errors: state.form.partner_errors,
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeHandler: (propName, propValue) => {
			dispatch(setCarProp(propName, propValue))
		},
		setPartnerErrorsHandler: (partner_errors) => {
			dispatch(setPartnerErrors(partner_errors))
		}
	}
};

const PopupHeaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PopupHeader);

export default PopupHeaderContainer;
