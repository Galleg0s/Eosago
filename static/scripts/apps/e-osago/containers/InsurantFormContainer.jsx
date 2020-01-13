import React, { Component } from 'react';
import { connect } from 'react-redux';

import InsurantForm from '../components/InsurantForm.jsx';

import { setInsurantProp, checkPhoneVerification, fetchSmsCode, setSmsCodeValid, setPartnerErrors } from '../actions.js';
import { getFormValidationResult, getFirstError } from '../selectors.js';
import { VERIFY_PHONE_NUMBER } from '../constants.js';

const mapStateToProps = state => {
	const validationResult = getFormValidationResult(state, 'insurant');

	return {
		data: state.insurant,
		errors: getFirstError(validationResult),
		isSmsCodeInvalid: state.form.isSmsCodeInvalid,
		isPhoneVerified: state.form.isPhoneVerified,
		companyId: state.form.company_id,
		eosagoPage: state.form.eosagoPage,
		partner_errors: state.form.partner_errors,
	}
};
const mapDispatchToProps = dispatch => {
	return {
		changeHandler: (propName, propValue) => {
			dispatch(setInsurantProp(propName, propValue))
		},
		checkPhoneVerificationHandler: (isReadyToCheck, verifyDataObj) => {
			isReadyToCheck && dispatch(checkPhoneVerification(verifyDataObj));
			!isReadyToCheck && dispatch({type: VERIFY_PHONE_NUMBER, params: {value: undefined}});
		},
		fetchSmsCodeHandler: (code) => {
			dispatch(fetchSmsCode(code));
		},
		setSmsCodeValidHandler: (value) => {
			dispatch(setSmsCodeValid(value));
		},
		setPartnerErrorsHandler: (partner_errors) => {
			dispatch(setPartnerErrors(partner_errors))
		},
	}
};

const InsurantFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(InsurantForm);

export default InsurantFormContainer;
