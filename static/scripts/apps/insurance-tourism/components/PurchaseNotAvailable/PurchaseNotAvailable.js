import React, {Component} from 'react';
import T from 'prop-types';
import { applyContainerQuery } from 'react-container-query';
import { connect } from 'react-redux';
import { Button, Link, Panel } from 'react-ui-2018';
import PolicyPrice from '../PolicyPrice/PolicyPrice';
import {
	insuredListSelector,
	insurerSelector,
	payOrder,
	preliminaryResultIdSelector,
	totalSumSelector,
} from '../../redux/modules/purchase';

import imageSrc from './vzr_not_available.svg';

const query = {
	md: {
		minWidth: 632
	},
	/** макет 320 */
	xs: {
		maxWidth: 631
	}
};

class PurchaseNotAvailable extends Component {
	static propTypes = {
		price: T.string,
		isPaymentProcessing: T.bool,
		insurer: T.shape(),
		insuredList: T.arrayOf(T.shape()),
		preliminaryResultId: T.number.isRequired,
		containerQuery: T.shape(),
	};

	static defaultProps = {
		isPaymentProcessing: false,
		insurer: {},
		insuredList: [],
		containerQuery: {},
	};

	retryPayment = () => {
		const { insurer, insuredList, preliminaryResultId } = this.props;
		const data = { insurer, insuredList };
		this.props.payOrder(preliminaryResultId, data);
	};

	goToEdit = () => {
		const { company, preliminaryResultId } = this.props;
		window.location = `/insurance/order/tourism/${company.code}/purchase/${preliminaryResultId}/`;
	};

	get content() {
		const { company, isPaymentProcessing, preliminaryResultId, price } = this.props;
		const editUrl = `/insurance/order/tourism/${company.code}/purchase/${preliminaryResultId}/`;
		const { xs, md } = this.props.containerQuery;

		if (xs) {
			return (
				<div className="text-align-center">
					<div>
						<img
							src={ imageSrc }
							width={ 172 }
							height={ 99 }
							alt=""
						/>
					</div>
					<h3 className="text-size-5 text-weight-bold margin-top-small margin-bottom-small">
						Хьюстон, у нас проблемы!
					</h3>
					<p className="text-size-6 padding-right-large padding-left-large">
						Кончился интернет, собака перегрызла провод, сосед рубанул топором по кабелю, или земля налетела на небесную ось. Выпейте чашку чая, все будет хорошо.
					</p>
					<div className="margin-top-default margin-bottom-default">
						<PolicyPrice price={ price } />
					</div>
					<div className="margin-top-default">
						<div className="flexbox flexbox--vert flexbox--gap_xs">
							<div className="flexbox__item">
								<Button
									onClick={ this.retryPayment }
									isLoading={ isPaymentProcessing }
									fullWidth={ true }
									size="large"
								>
									Повторить
								</Button>
							</div>
							<div className="flexbox__item flexbox__item--min">
								<Button
									onClick={ this.goToEdit }
									theme="transparent-light"
									fullWidth={ true }
									size="large"
								>
									Редактировать данные
								</Button>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="text-align-center">
					<div>
						<img
							src={ imageSrc }
							width={ 344 }
							height={ 198 }
							alt=""
						/>
					</div>
					<h3 className="text-size-3 margin-top-small margin-bottom-small">
						Хьюстон, у нас проблемы!
					</h3>
					<p className="text-size-4 padding-right-large padding-left-large">
						Кончился интернет, собака перегрызла провод, сосед рубанул топором по кабелю, или земля налетела на небесную ось. Выпейте чашку чая, все будет хорошо.
					</p>
					<div className="margin-top-default margin-bottom-default">
						<PolicyPrice price={ price } />
					</div>
					<div className="margin-top-default">
						<div className="flexbox flexbox--vert flexbox--gap_default">
							<div className="flexbox__item flexbox__item--min">
								<Button
									onClick={ this.retryPayment }
									isLoading={ isPaymentProcessing }
									size="medium"
								>
									Повторить
								</Button>
							</div>
							<div className="flexbox__item flexbox__item--min">
								<Link
									href={ editUrl }
								>
									Редактировать данные
								</Link>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}

	render() {
		return (
			<Panel
				sections={ [this.content] }
			/>
		);
	}
}

function mapStateToProps(state) {
	return {
		insurer: insurerSelector(state),
		insuredList: insuredListSelector(state),
		preliminaryResultId: preliminaryResultIdSelector(state),
		price: totalSumSelector(state),
	};
}

export default connect(mapStateToProps, {
	payOrder,
})(applyContainerQuery(PurchaseNotAvailable, query));
