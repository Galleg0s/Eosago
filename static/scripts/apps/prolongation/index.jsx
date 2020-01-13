import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button, Link, Panel } from 'react-ui-2018';
import {
	defaultState,
	CALCULATOR_URL,
	IS_CONFIRMED,
	IS_NOT_CONFIRMED,
	CHECK_RESULT_INFO_TIMEOUT,
	PAYMENT_URL_TIMEOUT,
	EMAIL_REG,
	ALFA_PARTNER_ID,
	INTERVAL_REQUEST, QUANTITY_REQUESTS,
} from './constants';
import ApiClient from './api';
import HeadInfo from './components/HeadInfo.jsx';
import PolicyInfo from './components/PolicyInfo.jsx';
import PurchaseForm from './components/PurchaseForm.jsx';

const api = new ApiClient();
const isMobile = banki.env.isMobileDevice;

export default params => {
	ReactDOM.render(<Prolongation hashRef={ params.hashRef } insurantEl={ params.insurantEl } />, params.containerEl);
};

class Prolongation extends Component {

	state = defaultState;

	componentDidMount() {
		const { hashRef } = this.props;
		this.setState({ isLoading: true});
		api.getCheckInfo(hashRef)
			.then(data => {
				data.car && this.setState({ car: data.car});
				data.drivers && this.setState({ drivers: data.drivers});
				data.insurant && this.setState({ insurant: data.insurant});
				data.insurant && data.insurant.email && this.setState({ email: data.insurant.email });
				data.insurant && data.insurant.phone && this.setState({ phone: data.insurant.phone });
				data.osago_policy_start_date && this.setState({ osago_policy_start_date: new Date(data.osago_policy_start_date)});
				this.setState({ isLoading: false});
				this.checkProlongate();
			})
			.catch(e => {
				this.showNotConfirmed();
				if (banki && banki.env && banki.env.devMode) {
					console.warn('Не удалось получить данные с сервера.')
				}
			});
	}

	checkProlongate() {
		const { hashRef } = this.props;
		this.setState({ loadingCheck: true });

		banki && banki.env && banki.env.devMode && console.log('hashRef', hashRef);
		api.checkProlongate(hashRef)
			.then(data => {
				banki && banki.env && banki.env.devMode && console.log('newHashRef', data.hashref);
				if (data && data.hashref) {
					this.setState({ newHashRef: data.hashref });
					this.checkResult();
				} else {
					this.showNotConfirmed();
				}
			})
			.catch(e => {
				this.showNotConfirmed();
				if (banki && banki.env && banki.env.devMode) {
					console.warn('Не удалось получить данные с сервера.')
				}
			});
	}

	checkResult() {
		const { newHashRef } = this.state;

		this.setState({ loadingCheck: true });

		const repeatCondition = (res) => {
			return res.status !== IS_CONFIRMED
		};

		api.repeat('checkResultInfo', repeatCondition, newHashRef, INTERVAL_REQUEST, QUANTITY_REQUESTS)
			.then(data => {
				let alfa_partner = data.result.filter(partner => {
					return partner.partner_id === ALFA_PARTNER_ID;
				});
				alfa_partner = alfa_partner && alfa_partner[0];

				if (data && data.status === IS_CONFIRMED && data.result && alfa_partner) {
					this.setState({
						status: IS_CONFIRMED,
						price: alfa_partner.premium_sum,
						checkResultId: alfa_partner.check_result_id,
						loadingCheck: false
					});
				} else if (data.status === 1) {
					this.setState({
						status: CHECK_RESULT_INFO_TIMEOUT,
						loadingCheck: false
					});
				} else {
					this.showNotConfirmed();
				}
			})
			.catch(e => {
				this.showNotConfirmed();
				if (banki && banki.env && banki.env.devMode) {
					console.warn('Не удалось получить данные с сервера.')
				}
			});
	}

	updateUserData() {
		const { email, phone, newHashRef} = this.state;
		const cleanPhone = phone && phone.replace(/[-()\s]/g, '');

		api.checkUpdate(newHashRef, email, cleanPhone)
			.then(data => {
				if (data.id) {
					this.fetchPurchase();
				} else {
					this.setState({ loadingPurchase: false });
					this.showNotConfirmed();
				}
			})
			.catch(e => {
				this.setState({ loadingPurchase: false });
				if (banki && banki.env && banki.env.devMode) {
					console.warn('Не удалось получить данные с сервера.')
				}
			});
	}

	purchase = () => {
		const { email, phone, insurant } = this.state;
		banki && banki.env && banki.env.devMode && console.log('purchase');
		this.setState({
			status: IS_CONFIRMED,
			loadingPurchase: true
		});
		if (insurant && (insurant.email !== email || insurant.phone !== phone)) {
			this.updateUserData();
		} else {
			this.fetchPurchase();
		}
	};

	fetchPurchase() {
		const { checkResultId } = this.state;

		api.purchaseStart(checkResultId)
			.then(data => {
				if (data.success === true) {
					const repeatCondition = (res) => {
						return res.status !== 1
					};

					api.repeat('getPaymentUrl', repeatCondition, data.id, INTERVAL_REQUEST, QUANTITY_REQUESTS)
						.then(data => {
							if (data.success) {
								this.setState({
									status: IS_CONFIRMED,
									purchase_url: data.info,
									loadingPurchase: false
								});
							} else if (data.status !== 1) {
								this.setState({
									status: PAYMENT_URL_TIMEOUT,
									loadingCheck: false
								});
							} else {
								this.showNotConfirmed();
							}
						})
						.catch(e => {
							this.setState({ loadingPurchase: false });
							this.showNotConfirmed();
							if (banki && banki.env && banki.env.devMode) {
								console.warn('Не удалось получить данные с сервера.')
							}
						});
				} else {
					this.setState({ loadingPurchase: false });
					this.showNotConfirmed();
				}
			})
			.catch(e => {
				this.setState({ loadingPurchase: false });
				this.showNotConfirmed();
				if (banki && banki.env && banki.env.devMode) {
					console.warn('Не удалось получить данные с сервера.')
				}
			});
	}

	showNotConfirmed() {
		this.setState({ status: IS_NOT_CONFIRMED, loadingCheck: false });
	}

	changeHandler = event => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState({ [name]: value });

		if (name === 'phone') {
			if (value.length === 16) {
				this.setState({ phoneStatus: 'default' });
			} else {
				this.setState({ phoneStatus: 'error' });
			}
		} else if (name === 'email') {
			if (value && value.match(EMAIL_REG)) {
				this.setState({ emailStatus: 'default' });
			} else {
				this.setState({ emailStatus: 'error' });
			}
		}
	};

	trackingClick = () => {
		const { newHashRef } = this.state;
		const newHashRefSplit = newHashRef && newHashRef.split(':');
		const newId = newHashRefSplit && newHashRefSplit[0];
		const trackingUrl = `https://tracking.banki.ru/SL1X6?adv_sub=${newId}`;
		const trackingElement = new Image();
		trackingElement.src = trackingUrl;
	};

	render() {
		const { isLoading, loadingCheck, loadingPurchase, car, drivers, insurant, email, phone, osago_policy_start_date, newHashRef, price, status, purchase_url, phoneStatus, emailStatus } = this.state;

		return (
			<Fragment>
				<HeadInfo insurant={ insurant } osagoPolicyStartDate={ osago_policy_start_date } />

				{ isLoading && (
					<div className="text-align-center">
						<div className="ui-loader-icon ui-loader-icon-big margin-top-large-fixed" />
					</div>
				) }

				{ !isLoading && insurant && drivers && (
					<div className="grid bg-major-dark-blue padding-default">
						<div className="grid__row">
							<div className="grid-2019__col-xs-4 grid-2019__col-sm-12 grid-2019__col-hsm-5 grid-2019__col-md-5 grid-2019__col-lg-5 grid-2019__col-xl-8 padding-bottom-medium">
								<PolicyInfo car={ car } drivers={ drivers } osagoPolicyStartDate={ osago_policy_start_date } />
							</div>
							<div className="grid-2019__col-xs-4 grid-2019__col-sm-12 grid-2019__col-hsm-6 grid-2019__offset-hsm-1 grid-2019__col-md-6 grid-2019__offset-md-1 grid-2019__col-lg-6 grid-2019__offset-lg-1 grid-2019__col-xl-8 padding-bottom-small-fixed">
								<Panel
									className="margin-bottom-medium-fixed"
									sections={
										<Fragment>
											{ loadingCheck && (
												<div className="text-align-center margin-top-large-fixed margin-bottom-large-fixed">
													<div className="margin-bottom-small-fixed">Делаем расчет</div>
													<div className="ui-loader-icon ui-loader-icon-big" />
												</div>
											) }

											{ !loadingCheck && status === IS_NOT_CONFIRMED && (
												<div className={ !isMobile && 'padding-large' }>
													<div className={ isMobile ? 'text-size-3 margin-bottom-medium' : 'text-size-6 margin-bottom-small' }>
														Подтверждение от страховой на пролонгацию договора не получено.
														Воспользутесь калькулятором, чтобы подобрать себе полис.
													</div>
													<Button
														theme="orange"
														size={ isMobile ? 'large' : 'medium' }
														fullWidth={ isMobile }
														href={ `${CALCULATOR_URL}${newHashRef}` }
													>
														Подобрать полис
													</Button>
												</div>
											) }

											{ !loadingCheck && (status === CHECK_RESULT_INFO_TIMEOUT || status === PAYMENT_URL_TIMEOUT) && (
												<div className={ !isMobile && 'padding-large' }>
													<div className={ isMobile ? 'text-size-3 margin-bottom-medium' : 'text-size-6 margin-bottom-small' }>
														Не получен ответ от страховой. Попробуйте снова или воспользуйтесь калькулятором чтобы подобрать полис.
													</div>
													<div className="margin-bottom-small">
														<Button
															theme="blue"
															size={ isMobile ? 'large' : 'medium' }
															fullWidth={ isMobile }
															onClick={ status === CHECK_RESULT_INFO_TIMEOUT ? this.checkResult.bind(this) : this.purchase }
														>
															Попробовать еще раз
														</Button>
													</div>
													<div>
														<Button
															theme="orange"
															size={ isMobile ? 'large' : 'medium' }
															fullWidth={ isMobile }
															href={ `${CALCULATOR_URL}${newHashRef}` }
														>
															Подобрать полис
														</Button>
													</div>
												</div>
											) }

											{ !loadingCheck && status === IS_CONFIRMED && (
												<PurchaseForm
													changeHandler={ this.changeHandler }
													purchaseHandler={ this.purchase }
													trackingClick={ this.trackingClick }
													purchaseUrl={ purchase_url }
													emailStatus={ emailStatus }
													phoneStatus={ phoneStatus }
													price={ price }
													email={ email }
													phone={ phone }
													loadingPurchase={ loadingPurchase }
												/>
											) }
										</Fragment>
									}
								/>

								{ !loadingCheck && status === IS_CONFIRMED && (
									<div className={ isMobile && 'text-align-center' }>
										<Link href={ CALCULATOR_URL } theme="dark" target="_blank" size="small">
											Оформить полис с другими параметрами
										</Link>
									</div>
								) }

							</div>
						</div>
					</div>
				) }

			</Fragment>
		)
	}
}
