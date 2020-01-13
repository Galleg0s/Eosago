import React from 'react';
import { connect } from 'react-redux';

import InputForm from '../components/InputForm.jsx';

const mapStateToProps = state => {
	return {
		multidrive: state.form.multidrive,
		selectedStepIndex: state.form.selectedStepIndex
	}
};

const InputFormContainer = connect(
	mapStateToProps,
)(InputForm);

export default InputFormContainer;
