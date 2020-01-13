import React, { Component } from 'react';
import T from 'prop-types';
import { Panel, Icon, Button, Link } from 'react-ui-2018';
import { companyType } from '../../types';
import PolicyPrice from '../PolicyPrice/PolicyPrice';
import errorNumberSmsImg from './error-number-sms.svg';
import errorNumberCardImg from './error-number-card.svg';
import errorImg from './error.svg';

const getImageSource = (id) => {
	switch (id) {
		case '100':
		case '102':
			return errorNumberSmsImg;
		case '101':
			return errorNumberCardImg;
		case '103':
			return errorImg;
		default:
			return errorImg
	}
};

export default class PaymentFailure extends Component {
	static propTypes = {
		price: T.string,
		resultId: T.number.isRequired,
		preliminaryResultId: T.number.isRequired,
		company: companyType,
		insurer: T.shape(),
		insuredList: T.arrayOf(T.shape()),
		redoOrderPayment: T.func,
		isPaymentProcessing: T.bool,
		resultHash: T.string.isRequired,
		error: T.shape({
			text: T.string,
			description: T.string,
		}),
		containerQuery: T.shape(),
	};

	static defaultProps = {
		price: '',
		insurer: {},
		error: {},
		insuredList: [],
		redoOrderPayment: () => {},
		isPaymentProcessing: false,
		containerQuery: {},
	};

	componentDidMount() {
		const { resultHash } = this.props;
		this.props.fetchPaymentInfo(resultHash);
	}

	goToEdit = () => {
		const { company, preliminaryResultId } = this.props;
		window.location = `/insurance/order/tourism/${company.code}/purchase/${preliminaryResultId}/`;
	};

	get content() {
		const { company, error, preliminaryResultId } = this.props;
		const editUrl = `/insurance/order/tourism/${company.code}/purchase/${preliminaryResultId}/`;
		const imageSrc = getImageSource(error.id);
		const { xs, md } = this.props.containerQuery;

		if (xs) {
			return (
				<div className="text-align-center">
					<div>
						<img
							src={ imageSrc }
							width={ 172 }
							height={ 85 }
							alt="Ошибка оплаты"
						/>
					</div>
					<h3 className="text-size-5 text-weight-bold margin-top-small margin-bottom-small">
						{error.description}
					</h3>
					<p className="text-size-6">
						{error.text}
					</p>
					<div className="margin-top-default margin-bottom-default">
						<PolicyPrice price={ this.props.price } />
					</div>
					<div className="margin-top-default">
						<div className="flexbox flexbox--vert flexbox--gap_xs">
							<div className="flexbox__item">
								<Button
									onClick={ this.retryPayment }
									isLoading={ this.props.isPaymentProcessing }
									fullWidth={ true }
									size="large"
								>
									Оплатить
								</Button>
							</div>
							<div className="flexbox__item flexbox__item--min">
								<Button
									onClick={ this.goToEdit }
									theme="transparent-light"
									size="large"
									fullWidth={ true }
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
							height={ 170 }
							alt="Ошибка оплаты"
						/>
					</div>
					<h3 className="text-size-3 margin-top-small margin-bottom-small">
						{error.description}
					</h3>
					<p className="text-size-4">
						{error.text}
					</p>
					<div className="margin-top-default margin-bottom-default">
						<PolicyPrice price={ this.props.price } />
					</div>
					<div className="margin-top-default">
						<div className="flexbox flexbox--vert flexbox--gap_default">
							<div className="flexbox__item flexbox__item--min">
								<Button
									onClick={ this.retryPayment }
									isLoading={ this.props.isPaymentProcessing }
									size="medium"
								>
									Оплатить
								</Button>
							</div>
							<div className="flexbox__item flexbox__item--min">
								<Link href={ editUrl }>
									Редактировать данные
								</Link>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}

	retryPayment = () => {
		const { insurer, insuredList, preliminaryResultId } = this.props;
		const data = { insurer, insuredList };
		this.props.redoOrderPayment(preliminaryResultId, data);
	};

	render() {
		return (
			<Panel
				sections={ [this.content] }
			/>
		);
	}
}
