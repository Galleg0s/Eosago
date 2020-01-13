import React, { Component } from 'react';
import { connect } from 'react-redux';

import Results from '../components/Results.jsx';

import {
	purchaseStart,
	setOfferProps,
	setCompanyId,
	tryToSetSelectedStep,
	setResultStatus,
	setPartnerErrors,
} from '../actions.js';
import { EOSAGO_STEPS, CANCEL_RESULT } from '../constants.js';

const mapStateToProps = state => {
	return {
		results: state.result.results,
		partner_errors: state.form.partner_errors,
		companyId: state.form.company_id,
		status: state.result.status,
		policies: state.policies,
		email: state.owner.email || state.insurant.email,
		paymentUrls: state.form.paymentUrls
	}
};

const mapDispatchToProps = (dispatch, resultsProps) => {
	return {
		purchaseStartHandler: (checkResultId) => {
			dispatch(purchaseStart(checkResultId));

		},
		setOtherOfferHandler: (id, logo, name, price) => {
			dispatch(setOfferProps({logo, name, price}));
			dispatch(setCompanyId(id));
		},
		cancelResultHandler: () => {
			dispatch({ type: CANCEL_RESULT });
			dispatch(setResultStatus(undefined));
			dispatch(tryToSetSelectedStep(0));
		},
		setResultHandler: (status) => {
			dispatch(setResultStatus(status));
		},
		showPartnerError: (partnerError) => {
			dispatch({ type: CANCEL_RESULT });
			dispatch(setResultStatus(undefined));
			dispatch(tryToSetSelectedStep(EOSAGO_STEPS[partnerError.form_step]));
			dispatch(setPartnerErrors(partnerError));
		}
	}
};

const ResultsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Results);

export default ResultsContainer;
