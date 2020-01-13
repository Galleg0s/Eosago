import React, { Component } from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { GridWrapper, GridRow, GridCol } from 'react-ui-2018';
import { calculationResult, companyType } from '../../types';
import PurchaseHeader from '../../components/PurchaseHeader/PurchaseHeader';
import PurchaseForm from '../../components/PurchaseForm/PurchaseForm';
import PurchaseNotAvailable from '../../components/PurchaseNotAvailable/PurchaseNotAvailable';
import PurchaseRecalculate from '../../components/PurchaseRecalulate/PurchaseRecalculate';
import PaymentSuccess from '../../components/PaymentSuccess/PaymentSuccess';
import PaymentFailure from '../../components/PaymentFailure';
import PaymentConditions from '../../components/PaymentConditions/PaymentConditions';
import ModalRoot from '../ModalRoot/ModalRoot';

import {
	fetchCalculationResult,
	fetchPaymentResult,
	fetchPolicies,
	fetchingPoliciesSelector,
	isPaymentProcessingSelector,
	recalculatingSelector,
	calculationResultSelector,
	countriesSelector,
	requestSelector,
	policiesSelector,
	hasSchengenSelector,
	priceValueSelector,
	purchaseCompanySelector,
	isLoadingSelector,
	paymentStatusSelector,
} from '../../redux/modules/purchase';
import s from './Purchase.module.styl';

class Purchase extends Component {
	static propTypes = {
		isLoading: T.bool,
		resultId: T.number.isRequired,
		resultHash: T.string.isRequired,
		price: T.string,
		roundedPrice: T.string,
		request: T.shape().isRequired,
		result: calculationResult,
		company: companyType,
		fetchCalculationResult: T.func.isRequired,
		fetchPaymentResult: T.func.isRequired,
		fetchPolicies: T.func.isRequired,
		status: T.oneOf(['order', 'payment', 'recalculate', 'successful', 'failed']),
		isFetchingPolicies: T.bool,
		isPaymentProcessing: T.bool,
		isRecalculating: T.bool,
		policies: T.arrayOf(T.shape()),
		searchUrl: T.string,
		hasSchengen: T.bool,
		onMount: T.func,
	};

	static defaultProps = {
		isLoading: true,
		price: null,
		status: 'order',
		isFetchingPolicies: true,
		isPaymentProcessing: false,
		isRecalculating: false,
		policies: [],
		searchUrl: '',
		hasSchengen: false,
	};

	state = {
		unsuccessful_payment_GA: false
	};

	componentDidMount() {
		const { status, resultId } = this.props;
		if (this.props.onMount) {
			this.props.onMount();
		}
		switch (status) {
			case 'order':
				this.props.fetchCalculationResult(resultId);
				break;
			case 'successful':
				this.props
					.fetchPaymentResult(resultId)
					.then(({ result }) => this.props.fetchPolicies(result.id));
				break;
			case 'not_available':
			case 'recalculate':
			case 'failed':
				this.props.fetchPaymentResult(resultId);
				break;
			default:
				break;
		}
	}

	get content() {
		const {
			status,
			result,
			resultId,
			request,
			policies,
			company,
			resultHash,
			isFetchingPolicies,
			isPaymentProcessing,
			isRecalculating,
			searchUrl,
			priceValue
		} = this.props;
		const companyCode = company && company.code;
		switch (status) {
			case 'order':
				return (
					<PurchaseForm
						company={ company }
						resultId={ resultId }
						request={ request }
						isRecalculating={ isRecalculating }
					/>
				);
			case 'recalculate':
				return (
					<PurchaseRecalculate
						request={ request }
						isPaymentProcessing={ isPaymentProcessing }
						searchUrl={ searchUrl }
					/>
				);
			case 'successful':
				return (
					<PaymentSuccess
						isProcessing={ isFetchingPolicies }
						policies={ policies }
					/>
				);
			case 'failed':
				return (
					<PaymentFailure
						resultId={ resultId }
						company={ company }
						resultHash={ resultHash }
						isPaymentProcessing={ isPaymentProcessing }
					/>
				);
			case 'not_available':
				return (
					<PurchaseNotAvailable
						company={ company }
						isPaymentProcessing={ isPaymentProcessing }
						searchUrl={ searchUrl }
					/>
				);
			default:
				return null;
		}
	}

	render() {
		const {
			status,
			roundedPrice,
			request,
			result,
			countries,
			company,
			searchUrl,
			hasSchengen,
			isLoading,
		} = this.props;
		if (isLoading) {
			// TODO: Display spinner/loader
			return null;
		}
		return (
			<div className={ cx(s.root, s[`status_${status}`]) }>
				<div className="bg-minor-black-lighten2">
					<PurchaseHeader
						request={ request }
						company={ company }
						countries={ countries }
						searchUrl={ searchUrl }
						hasSchengen={ hasSchengen }
						status={ status }
					/>
					<GridWrapper mode="grid-2019">
						<GridRow>
							<GridCol
								xs={ 4 }
								lgOffset={ 1 }
								lg={ 10 }
							>
								<div className={ s.form }>
									{this.content}
								</div>
							</GridCol>
						</GridRow>
						<GridRow>
							<GridCol xs={ 4 }>
								<div className="margin-top-default margin-bottom-large margin-bottom-mobile-medium">
									<PaymentConditions />
								</div>
							</GridCol>
						</GridRow>
					</GridWrapper>
				</div>
				<ModalRoot />
			</div>
		);
	}
}

function mapStateToProps(state) {
	const result = calculationResultSelector(state);

	return {
		result,
		status: paymentStatusSelector(state),
		isLoading: isLoadingSelector(state),
		company: purchaseCompanySelector(state),
		priceValue: priceValueSelector(state),
		request: requestSelector(state),
		countries: countriesSelector(state),
		isFetchingPolicies: fetchingPoliciesSelector(state),
		isPaymentProcessing: isPaymentProcessingSelector(state),
		isRecalculating: recalculatingSelector(state),
		policies: policiesSelector(state),
		hasSchengen: hasSchengenSelector(state),
	};
}

export default connect(mapStateToProps, {
	fetchCalculationResult,
	fetchPaymentResult,
	fetchPolicies,
})(Purchase);
