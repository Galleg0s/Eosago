import React, { Component } from 'react';
import { connect } from 'react-redux';

import OwnerIsAnInsurantToggler from '../components/OwnerIsAnInsurantToggler.jsx';

import { setOwnerIsAnInsurant, clearOwner } from '../actions.js';

const mapStateToProps = state => {
	return {
		value: state.form.ownerIsAnInsurant
	}
};
const mapDispatchToProps = dispatch => {
	return {
		changeHandler: (value) => {
			if (value !== true) {
				dispatch(clearOwner());
			}
			dispatch(setOwnerIsAnInsurant(value))
		}
	}
};

const OwnerIsAnInsurantTogglerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnerIsAnInsurantToggler);

export default OwnerIsAnInsurantTogglerContainer;
