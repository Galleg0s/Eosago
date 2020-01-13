import React, {Component} from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { applyContainerQuery } from 'react-container-query';
import { connect } from 'react-redux';
import qs from 'query-string';
import { Button, Panel } from 'react-ui-2018';
import PolicyPrice from '../PolicyPrice/PolicyPrice';
import {
	insuredListSelector,
	insurerSelector,
	payOrder,
	preliminaryResultIdSelector,
	totalSumSelector,
} from '../../redux/modules/purchase';
import {
	calculateAge
} from '../../utils/utils';

import imageSrc from './vzr_recalculate.png';

const query = {
	md: {
		minWidth: 632
	},
	/** макет 320 */
	xs: {
		maxWidth: 631
	}
};

class PurchaseRecalculate extends Component {
	static propTypes = {
		request: T,
		price: T.string,
		isPaymentProcessing: T.bool,
		insurer: T.shape(),
		insuredList: T.arrayOf(T.shape()),
		preliminaryResultId: T.number.isRequired,
		searchUrl: T.string
	};

	static defaultProps = {
		isPaymentProcessing: false,
		insurer: {},
		insuredList: [],
	};

	get toSearch() {
		const { request, searchUrl } = this.props;
		const { countries, startDate, endDate, options, birthDates } = request;
		const urlParams = {
			countries,
			startDate,
			endDate,
			options: options.map(item => item.id),
			ages: birthDates.map(item => calculateAge(new Date(item))),
		};
		return `${searchUrl}?${qs.stringify(urlParams, { arrayFormat: 'bracket' })}`;
	}

	retryPayment = () => {
		const { insurer, insuredList, preliminaryResultId } = this.props;
		const data = { insurer, insuredList };
		this.props.payOrder(preliminaryResultId, data);
	};

	get content() {
		const { isPaymentProcessing, price } = this.props;
		const { xs, md } = this.props.containerQuery;

		if (xs) {
			return (
				<div className="text-align-center">
					<div>
						<img
							src={ imageSrc }
							width={ 172 }
							height={ 99 }
							alt="Стоимость полиса изменилась"
						/>
					</div>
					<h3 className="text-size-5 text-weight-bold margin-top-small margin-bottom-small">
						Стоимость полиса изменилась
					</h3>
					<p className="text-size-6">
						Мы отправили запрос в страховую и получили перерасчет тарифов дополнительных опций.
					</p>
					<div className="margin-top-default margin-bottom-default">
						<PolicyPrice price={ price } />
					</div>
					<div className="margin-top-default">
						<div className="flexbox flexbox--vert flexbox--gap_xs">
							<Button
								theme="transparent-light"
								href={ this.toSearch }
								size="large"
							>
								Выбрать другой полис
							</Button>
							<Button
								onClick={ this.retryPayment }
								isLoading={ isPaymentProcessing }
								size="large"
							>
								Оплатить
							</Button>
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
							alt="Стоимость полиса изменилась"
						/>
					</div>
					<h3 className="text-size-3 margin-top-small margin-bottom-small">
						Стоимость полиса изменилась
					</h3>
					<p className="text-size-4">
						Мы отправили запрос в страховую и получили перерасчет тарифов дополнительных опций.
					</p>
					<div className="margin-top-default margin-bottom-default">
						<PolicyPrice price={ price } />
					</div>
					<div className="margin-top-default">
						<div className="flexbox flexbox--row flexbox--gap_medium flexbox--justify-content_center">
							<Button
								theme="transparent-light"
								href={ this.toSearch }
								size="medium"
							>
								Выбрать другой полис
							</Button>
							<Button
								onClick={ this.retryPayment }
								isLoading={ isPaymentProcessing }
								size="medium"
							>
								Оплатить
							</Button>
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
})(applyContainerQuery(PurchaseRecalculate, query));
