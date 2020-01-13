import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Flex, Progress, AlertPanel, Icon } from 'react-ui';
const { Line } = Progress;
import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';
import { moneyFormat } from 'helpers';
import Hash from '../../../_common/utils/hash.js';

import {
	SHOW_RESULTS_TO_EMAIL,
	SHOW_URL_TO_RESULT,
	SHOW_URL_TO_EMAIL,
	SERVICE_IS_UNAVAILABLE,
	SHOW_RGS_SMS_AUTH,
	INGOS_COMPANY_ID,
	ALFA_COMPANY_ID,
	ALFA_PLUS_COMPANY_ID,
	RGS_COMPANY_ID,
	TINKOFF_COMPANY_ID,
	SOGLASIE_COMPANY_ID,
	NASKO_COMPANY_ID,
	gaCategory,
} from '../constants.js';
import AuthSMS from "./AuthSMS.jsx";
import ContentWrapper from '../layout/ContentWrapper.jsx';

const LOADER_STEP = 6;		// значение, на которое увеличивается лоадер, в %
const LOADER_FREQ = 3000;	// частота обновления значения лоадера в мс

class Results extends Component {
	static propTypes = {
		cancelResultHandler: PropTypes.func.isRequired,
		showPartnerError: PropTypes.func.isRequired,
		companyId: PropTypes.number.isRequired,
		email: PropTypes.string.isRequired,
		isMobile: PropTypes.bool,
		partner_errors: PropTypes.arrayOf(PropTypes.shape),
		paymentUrls: PropTypes.array,
		policies: PropTypes.shape({
			allPaperPolicies: PropTypes.array,
			eosagoPolicies: PropTypes.array,
			paperPolicy: PropTypes.shape,
		}),
		purchaseStartHandler: PropTypes.func.isRequired,
		results: PropTypes.arrayOf(PropTypes.shape),
		setOtherOfferHandler: PropTypes.func.isRequired,
		setResultHandler: PropTypes.func.isRequired,
		status: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	};

	static defaultProps = {
		isMobile: false,
	};

	state = {
		isShowPaperPolicies: false,
		progressPercent: 0
	};

	componentDidMount() {
		this.startLoader();
	}

	componentWillUnmount() {
		this.resetLoader();
	}

	resetLoader = () => {
		clearInterval(this.loaderInterval);
		this.setState({
			progressPercent: 0
		})
	};

	startLoader = () => {
		this.loaderInterval = setInterval(this.increaseProgressPercent, LOADER_FREQ);
	};

	increaseProgressPercent = () => {
		this.setState(prevState => ({
			progressPercent: prevState.progressPercent + LOADER_STEP
		}));
	};

	showPaperResults = () => {
		eventEmitter.emit('insurance:e-osago-checkout-close');
	};

	buyPoliceBtnHandler = (check_result_id) => () => {
		const { purchaseStartHandler } = this.props;

		this.resetLoader();
		this.startLoader();

		purchaseStartHandler(check_result_id);

		dataLayer.push({ 'event':'GTM_event',
			'eventCategory': gaCategory,
			'eventAction': 'e-OSAGO_check_step_passed',
			'eventLabel': undefined,
			'eventValue': undefined
		});
	};

	editBtnHandler = (partner_error) => () => {
		const { showPartnerError, setOtherOfferHandler } = this.props;

		showPartnerError(partner_error);
		setOtherOfferHandler(partner_error.id, partner_error.logo, partner_error.name, partner_error.price);
	};

	paymentClick = (paymentUrl, companyId) => () => {
		let trackingUrl = 'https://tracking.banki.ru/';

		const trackingUrlForCompany = {
			[INGOS_COMPANY_ID]: 'SLmn',  // Ингосстрах
			[ALFA_COMPANY_ID]: 'SLml',  // АльфаСтрахование
			[ALFA_PLUS_COMPANY_ID]: 'SLml', // АльфаСтрахование плюс
			[TINKOFF_COMPANY_ID]: 'SL1Jz',  // Тинькофф
			[RGS_COMPANY_ID]: 'SL1L1',  // РГС
			[SOGLASIE_COMPANY_ID]: 'SL1S1',  // Согласие
			[NASKO_COMPANY_ID]: 'GL1Ug',  // НАСКО
		};

		const result = this.selectedCompanyResult();
		dataLayer.push({ 'event': 'GTM_event',
			'eventCategory': gaCategory,
			'eventAction': 'e-OSAGO_goto_pay',
			'eventLabel': result.company ? result.company.name : undefined,
			'eventValue': undefined
		});


		const calculationHash = Hash.get();
		const calculationHashArray = calculationHash && calculationHash.split(':');
		const calculationId = calculationHashArray && calculationHashArray[0];

		if (trackingUrlForCompany[companyId]) {
			trackingUrl += `${trackingUrlForCompany[companyId]}?adv_sub=${calculationId}`;
			const trackingElement = new Image(1, 1);
			trackingElement.src = trackingUrl;
		}

		window.open(paymentUrl, '_blank');
	};

	selectedCompanyResult = () => this.props.results.find((result) => result.company.id === this.props.companyId);
	otherCompaniesResults = () => this.props.results.filter((result) => result.company.id !== this.props.companyId);
	otherCompaniesErrors = () => {
		const { eosagoPolicies } = this.props.policies;
		let otherCompaniesErrorsArray = [];
		this.props.partner_errors.forEach(item => {
			for (let company_id in item) {
				let errorPolicy = {};
				eosagoPolicies && eosagoPolicies.forEach((policy) => {
					if (policy.company.id === Number(company_id) && this.props.companyId !== Number(company_id)) {
						Object.assign(errorPolicy, item[company_id]);
						errorPolicy.id = Number(company_id);
						errorPolicy.name = policy.company.name;
						errorPolicy.logo = policy.company.logo;
						errorPolicy.price = policy.products.osago.raw_price;

						otherCompaniesErrorsArray.push(errorPolicy);
					}
				});
			}
		});


		otherCompaniesErrorsArray.sort((a, b) => {
			if (a.price > b.price) return 1;
			if (a.price < b.price) return -1;
		});

		return otherCompaniesErrorsArray;
	};

	get urlToEmailContent() {
		const { email } = this.props;

		return (
			<Fragment>
				<ContentWrapper>
					<Flex justifyContent="space-between" direction="column" gap="default">
						<Icon
							name="ok-circled"
							color="green"
							size="large"
						/>
						<p className="font-size-medium">
							Полис готов к оплате! Вам на почту { email } выслана информация и ссылка на оплату.
						</p>
					</Flex>
				</ContentWrapper>
				<div className="bg-gray padding-top-default padding-right-medium padding-bottom-default padding-left-medium">
					<Button
						theme="gray"
						size="medium"
						bordered="true"
						clickHandler={() => {
							eventEmitter.emit('insurance:e-osago-checkout-close');
						}}
					>
						Закрыть
					</Button>
				</div>
			</Fragment>
		);
	}

	get urlToResultContent() {
		const { paymentUrls, companyId } = this.props;
		const paymentInfo = paymentUrls && paymentUrls.find((item) => item.companyId === companyId);
		const paymentUrl = paymentInfo && paymentInfo.paymentUrl;

		return (
			<Fragment>
				<ContentWrapper>
					<Flex justifyContent="space-between" direction="column" gap="default">
						<Icon
							name="ok-circled"
							color="green"
						/>
						<p className="font-size-medium">Полис готов к оплате!</p>
					</Flex>
				</ContentWrapper>
				<div
					className="bg-gray padding-top-default padding-right-medium padding-bottom-default padding-left-medium">
					<div className="inline-elements">
						<Button
							clickHandler={ this.paymentClick(paymentUrl, companyId) }
							theme="orange"
						>
							Оплатить полис
						</Button>
						<Button
							theme="gray"
							size="medium"
							bordered="true"
							clickHandler={() => {
								eventEmitter.emit('insurance:e-osago-checkout-close');
							}}
						>
							Закрыть
						</Button>
					</div>

				</div>
			</Fragment>
		);
	}

	get serviceUnavaliableContent() {
		const { cancelResultHandler } = this.props;

		return (
			<div>
				<ContentWrapper>
					<Flex justifyContent="space-between" direction="column" gap="default">
						<p className="font-size-medium">Сервис оформления полиса е-ОСАГО временно недоступен. Введённые вами данные сохранены и вы сможете повторить расчёт позже.</p>
					</Flex>
				</ContentWrapper>
				<div className="bg-gray padding-top-default padding-right-medium padding-bottom-default padding-left-medium">
					<Button
						bordered={ true }
						size="medium"
						clickHandler={ cancelResultHandler }
					>
						Вернуться
					</Button>
				</div>
			</div>
		);
	}

	get loadingContent() {
		const { cancelResultHandler } = this.props;

		return (
			<Fragment>
				<ContentWrapper>
					<Line
						percent={ this.state.progressPercent }
						strokeWidth="0.7"
						trailWidth="0.7"
						strokeColor="#2ECC71"
						trailColor="#DDE5E7"
						height="4"
					/>
					<p className="font-size-medium margin-top-default">
						Проверка указанных данных в базе Российского союза автостраховщиков (РСА). Подождите, это займет некоторое время.
					</p>
				</ContentWrapper>
				<div className="bg-gray padding-top-default padding-right-medium padding-bottom-default padding-left-medium">
					<Flex justifyContent="space-between">
						<Button
							bordered={ true }
							size="medium"
							clickHandler={ cancelResultHandler }
						>
							Редактировать данные
						</Button>
					</Flex>
				</div>
			</Fragment>
		);
	}

	get smsAuthContent() {
		return (
			<AuthSMS />
		);
	}

	get resultsContent() {
		const { cancelResultHandler, showPartnerError, setOtherOfferHandler, isMobile, status } = this.props;
		const selectedCompanyResults = this.selectedCompanyResult();
		const otherCompaniesResults = this.otherCompaniesResults();
		const otherCompaniesErrors = this.otherCompaniesErrors();
		const check_result_id = selectedCompanyResults && status === SHOW_RESULTS_TO_EMAIL ? selectedCompanyResults && selectedCompanyResults.check_result_id : undefined;

		return (
			<ContentWrapper>
				{ selectedCompanyResults ? (
					<Fragment>
						<p className="font-size-medium text-align-center">
							Подтверждение от страховой компании получено. <br/>Доступна покупка полиса онлайн.
						</p>
						<div className="text-align-center margin-top-small">
							<Button
								theme="orange"
								clickHandler={ this.buyPoliceBtnHandler(check_result_id) }
							>
								Купить полис
							</Button>
						</div>
					</Fragment>
				) : (
					<AlertPanel
						theme="warning"
					>
						<span className="font-size-medium">
							Подтверждение от страховой компании не получено. Онлайн покупка полиса недоступна. <a
							className="text-link" onClick={ cancelResultHandler }>Редактировать данные</a>
						</span>
					</AlertPanel>
				) }
				{ otherCompaniesResults.length > 0 &&
				<Fragment>
					<p className="font-size-medium margin-top-default margin-bottom-x-small">
						Получено подтверждение от других компаний
					</p>
					<Flex direction="column" gap="zero">
						{ otherCompaniesResults.map((result) =>
							<div className="padding-small border-dark-gray" key={result.id}
							     style={{'marginTop': '-1px'}}>
								<Flex direction={isMobile ? 'column' : 'row'}
								      className={isMobile ? 'text-align-center' : ''}>
									<div>
										<img src={result.company.logo} width="100" height="63"/>
									</div>
									<div>
										<div className="font-bold">е-ОСАГО</div>
										<div
											className="color-gray-blue margin-top-xx-small">{result.company.name}</div>
									</div>
									<div>
										<div className="font-size-large font-bold">
											{ moneyFormat(Math.ceil(result.premium_sum)) } ₽
										</div>
									</div>
									<div>
										<Button
											size="small"
											theme="orange"
											clickHandler={ () => {
												this.buyPoliceBtnHandler.bind(this, result.check_result_id);
												setOtherOfferHandler(result.company.id, result.company.logo, result.company.name, result.premium_sum);
											}}
										>
											Купить полис
										</Button>
									</div>
								</Flex>
							</div>
						)}
					</Flex>
				</Fragment>
				}
				{ otherCompaniesErrors.length > 0 &&
				<Fragment>
					<p className="font-size-medium margin-top-default margin-bottom-x-small">
						Требуется дополнительная информация
					</p>
					<Flex direction="column" gap="zero">
						{ otherCompaniesErrors.map((partner_error, index, key) =>
							<div className="padding-small border-dark-gray" key={ partner_error.id }
							     style={{'marginTop': '-1px'}}>
								<Flex direction={isMobile ? 'column' : 'row'}
								      className={isMobile ? 'text-align-center' : ''}>
									<div>
										<img src={ partner_error.logo } width="100" height="63"/>
									</div>
									<div>
										<div className="font-bold">е-ОСАГО</div>
										<div
											className="color-gray-blue margin-top-xx-small">{ partner_error.name }</div>
									</div>
									<div>
										<div className="font-size-large font-bold">
											{ moneyFormat(Math.floor(partner_error.price)) } ₽
										</div>
									</div>
									<div>
										<Button
											size="small"
											theme="orange"
											clickHandler={ this.editBtnHandler(partner_error ) }
										>
											Редактировать
										</Button>
									</div>
								</Flex>
							</div>
						)}
					</Flex>
				</Fragment>
				}
			</ContentWrapper>
		);
	}

	get actionsBtns() {
		const { cancelResultHandler } = this.props;

		return (
			<Fragment>
				<div className="bg-gray padding-top-default padding-right-medium padding-bottom-default padding-left-medium">
					<div className="inline-elements">
						<Button
							theme="gray"
							bordered={ true }
							clickHandler={ cancelResultHandler }
						>
							Редактировать данные
						</Button>
					</div>
				</div>
			</Fragment>
		)
	}

	render() {
		const { status } = this.props;

		switch (status) {
			case SHOW_RESULTS_TO_EMAIL:
				return (
					<Fragment>
						{ this.resultsContent }
						{ this.actionsBtns }
					</Fragment>
				);
			case SHOW_URL_TO_EMAIL:
				return this.urlToEmailContent;
			case SHOW_URL_TO_RESULT:
				return this.urlToResultContent;
			case SERVICE_IS_UNAVAILABLE:
				return this.serviceUnavaliableContent;
			case SHOW_RGS_SMS_AUTH:
				return this.smsAuthContent;
			default:
				return this.loadingContent;
		}
	}
}

export default Results;
