import React from 'react';
import { connect } from 'react-redux';

import {
	getPolicies,
	getPaymentUrl,
	getRequestStatus,
	getResultInfoRequestStatus
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/selectors';

import {
	purchaseStart,
	setRequestStatus,
	getResultInfo
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/actions';

import { ImageMessage, Spin } from 'react-ui-2018';
import Url from 'utils.url';
import Policies from './Policies';
import { REQUEST_STATUS } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/constants';
import { history } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux';

const ResultsList = (props: any) => {
	const { id } = Url(history.location.search).getParams();
	if (id && props.resultInfoRequestStatus === REQUEST_STATUS.IDLE) {
		props.getResultInfo(decodeURIComponent(id));
	}

	return (
		<div className="margin-bottom-2xl">
			{ (props.policies.length === 0) && (props.resultInfoRequestStatus !== REQUEST_STATUS.PENDING) ? (
				<ImageMessage
					imageType="notFound"
					message="От страховых компаний не получено одобрение."
					subMessage="Попробуйте изменить параметры расчета."
				/>
			) : <Policies { ...props } /> }
			{ props.resultInfoRequestStatus === REQUEST_STATUS.PENDING && (
				<div className="text-align-center padding-vert-default">
					<Spin size="large" color="gray" />
				</div>
			)}
		</div>
	)
};

const mapStateToProps = (state: any) => {
	return {
		requestStatus: getRequestStatus(state),
		resultInfoRequestStatus: getResultInfoRequestStatus(state),
		policies: getPolicies(state),
		paymentUrl: getPaymentUrl(state),
	};
};

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: string }) => void) => {
	return {
		purchaseStart: (companyId: string, check_result: string) => {
			dispatch(purchaseStart(companyId, check_result));
		},
		setRequestStatus: (status: string) => {
			dispatch(setRequestStatus(status));
		},
		getResultInfo: (id: number) => {
			dispatch(getResultInfo(id))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsList);
