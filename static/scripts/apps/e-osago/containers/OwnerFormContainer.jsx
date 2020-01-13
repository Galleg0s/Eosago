import React, { Component } from 'react';
import { connect } from 'react-redux';

import OwnerForm from '../components/OwnerForm.jsx';

import { setOwnerProp, checkPhoneVerification, fetchSmsCode, setSmsCodeValid } from '../actions.js';
import { getFormValidationResult, getFirstError } from '../selectors.js';
import { VERIFY_PHONE_NUMBER } from '../constants.js';

const mapStateToProps = state => {
	const validationResult = getFormValidationResult(state, 'owner');

	return {
		data: state.form.ownerIsAnInsurant ? state.insurant : state.owner,
		errors: getFirstError(validationResult),
		ownerIsAnInsurant: state.form.ownerIsAnInsurant,
		isSmsCodeInvalid: state.form.isSmsCodeInvalid,
		eosagoPage: state.form.eosagoPage,
		isPhoneVerified: state.form.isPhoneVerified,
	}
};
const mapDispatchToProps = dispatch => {
	return {
		changeHandler: (propName, propValue) => {
			dispatch(setOwnerProp(propName, propValue))
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
	}
};

const OwnerFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnerForm);

export default OwnerFormContainer;
