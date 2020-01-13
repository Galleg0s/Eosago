import React, { Component } from 'react';
import { connect } from 'react-redux';

import Offer from '../e-osago/components/Offer.jsx';
import ResultsContainer from './containers/ResultsContainer.jsx';
import InputFormContainer from './containers/InputFormContainer.jsx';
import PopupHeaderContainer from './containers/PopupHeaderContainer.jsx';

const EOsago = (props) => {
	const { logo, price, leadOptions, result, kbmStatus, isMobile } = props;

	const selectedCompanyResult = result.results.find((result) => result.chosen_by_user === true);

	return (
		<div>
			<PopupHeaderContainer
				isMobile={ isMobile }
			/>
			{
				logo && price && leadOptions && (
					<Offer
						companyLogo={ logo }
						price={ price }
						leadOptions={ leadOptions }
						isMobile={ isMobile }
						result={ selectedCompanyResult }
						kbmStatus={ kbmStatus }
					/>
				)
			}

			{ props.isFormSubmitted === true ? (
				<ResultsContainer isMobile={ isMobile } />
			) : (
				<InputFormContainer isMobile={ isMobile } />
			) }
		</div>
	);
};

const mapStateToProps = state => {
	return {
		isFormSubmitted: state.form.isFormSubmitted,
		...state.offer,
		result: state.result,
	}
};

const EOsagoContainer = connect(
	mapStateToProps
)(EOsago);

export default EOsagoContainer;
