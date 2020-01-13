import React, { Component } from 'react';
import { connect } from 'react-redux';

import MultidriveSwitcher from '../components/MultidriveSwitcher.jsx';

import { setMultidrive } from '../actions.js';
import { getMultidriveItems } from '../selectors.js';

const mapStateToProps = state => {
	return {
		value: state.form.multidrive,
		items: getMultidriveItems()
	}
};
const mapDispatchToProps = dispatch => {
	return {
		changeHandler: (value) => {
			dispatch(setMultidrive(value))
		}
	}
};

const MultidriveSwitcherContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MultidriveSwitcher);

export default MultidriveSwitcherContainer;
