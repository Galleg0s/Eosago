import React from 'react';
import { connect } from 'react-redux';

import AgreementForm from '../components/AgreementForm.jsx';

import { setInsurantProp } from '../actions.js';

const mapStateToProps = state => {

	return {
		data: state.insurant
	}
};
const mapDispatchToProps = dispatch => {
	return {
		changeHandler: (propName, propValue) => {
			dispatch(setInsurantProp(propName, propValue))
		}
	}
};

const AgreementFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AgreementForm);

export default AgreementFormContainer;
