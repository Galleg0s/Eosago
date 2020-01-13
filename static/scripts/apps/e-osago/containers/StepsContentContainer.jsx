import React, { Component } from 'react';
import { connect } from 'react-redux';

import StepsContent from '../components/StepsContent.jsx';

const mapStateToProps = state => {
	return {
		current: state.form.selectedStepIndex
	}
};

const StepsContentContainer = connect(
	mapStateToProps
)(StepsContent);

export default StepsContentContainer;
