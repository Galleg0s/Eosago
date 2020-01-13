import { connect } from 'react-redux';
import { applyContainerQuery } from 'react-container-query';
import PaymentFailure from './PaymentFailure';
import {
	insurerSelector,
	insuredListSelector,
	redoOrderPayment,
	fetchPaymentInfo,
	preliminaryResultIdSelector,
	paymentErrorSelector,
	totalSumSelector,
} from '../../redux/modules/purchase';

const query = {
	md: {
		minWidth: 632
	},
	/** макет 320 */
	xs: {
		maxWidth: 631
	}
};

function mapStateToProps(state) {
	return {
		insurer: insurerSelector(state),
		insuredList: insuredListSelector(state),
		error: paymentErrorSelector(state),
		preliminaryResultId: preliminaryResultIdSelector(state),
		price: totalSumSelector(state),
	};
}

export default connect(mapStateToProps, {
	redoOrderPayment,
	fetchPaymentInfo,
})(applyContainerQuery(PaymentFailure, query));
