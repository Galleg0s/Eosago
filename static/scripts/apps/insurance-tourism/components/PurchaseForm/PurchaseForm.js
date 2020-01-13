import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { reduxForm, Field, FieldArray, FormSection } from 'redux-form';
import { applyContainerQuery } from 'react-container-query';
import {
	Button,
	Checkbox,
	GridCol,
	FormField,
	GridWrapper,
	Icon,
	Link,
	Panel,
	GridRow,
} from 'react-ui-2018';
import { calculationResult, companyType } from '../../types';
import { emptyFunction } from '../../utils/utils';
import {
	toggleCrossSale,
	crossSalesSelector,
	fetchCrossSales,
	resetCrossSales,
	isFetchingCrossSalesSelector,
	isPaymentProcessingSelector,
	isBirthDatesFilledSelector,
	payOrder,
	insuredListFormValueSelector,
	priceValueSelector,
	PURCHASE_FORM_NAME,
	recalculateResult,
	totalSumSelector,
} from '../../redux/modules/purchase';
import {
	showConfirmSubscribeModal,
	showConfirmTermsModal,
} from '../../redux/modules/modals';
import PolicyPrice from '../PolicyPrice/PolicyPrice';
import InputDateField from '../InputDateField/InputDateField';
import TextField from '../TextField/TextField';
import CrossSalesField from '../CrossSalesField/CrossSalesField';
import validate from './validate';
import s from './PurchaseForm.module.styl';

import renderTourists from './render-tourists';
import PhoneField from '../PhoneField/PhoneField';
import { PassportFields } from 'react-ui-2018';

const PassportSeriesField = PassportFields('series');
const PassportNumberField = PassportFields('number');
const PassportIssuerCodeField = PassportFields('code');

const today = new Date();
const maxBirthDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

const query = {
	xs: {
		maxWidth: 735,
	},
	sm: {
		minWidth: 736,
		maxWidth: 991,
	},
	md: {
		minWidth: 992
	},
};

/** Сумма, свыше которой запрашиваем паспортные данные для СК КапиталЛайф */
const capitalLifeLimit = 15000;

class PurchaseForm extends Component {
	static propTypes = {
		company: companyType,
		price: T.string,
		result: calculationResult,
		request: T.shape(),
		handleSubmit: T.func,
		payOrder: T.func,
		isRecalculating: T.bool,
		fetchCrossSales: T.func,
		resetCrossSales: T.func,
		crossSales: T.arrayOf(T.shape()),
		isFetchingCrossSales: T.bool,
		isBirthDatesFilled: T.bool,
		isPaymentProcessing: T.bool,
		toggleCrossSale: T.func,
		showConfirmSubscribeModal: T.func,
		showConfirmTermsModal: T.func,
		recalculateResult: T.func,
		containerQuery: T.shape().isRequired,
	};

	static defaultProps = {
		isRecalculating: false,
		isBirthDatesFilled: false,
		isPaymentProcessing: false,
		price: '',
		result: {},
		request: {},
		toggleCrossSale: emptyFunction,
		handleSubmit: emptyFunction,
		payOrder: emptyFunction,
		fetchCrossSales: emptyFunction,
		resetCrossSales: emptyFunction,
		showConfirmSubscribeModal: emptyFunction,
		showConfirmTermsModal: emptyFunction,
		recalculateResult: emptyFunction,
	};

	state = {
		termsAgree: true,
		subscribeAgree: true,
		isTermsModalOpen: false,
		isSubscribeModalOpen: false,
	};

	toggleConfirm = (agreementType) => () => {
		switch (agreementType) {
			case 'terms':
				this.setState(
					prevState => ({
						termsAgree: !prevState.termsAgree,
					}),
				);
				break;
			case 'subscribe':
				this.setState(
					prevState => ({
						subscribeAgree: !prevState.subscribeAgree,
					}),
				);
				break;
		}
	};

	closeModal = () => this.setState({ isTermsModalOpen: false, isSubscribeModalOpen: false });

	openModal = (modalType) => (event) => {
		event && event.stopPropagation();
		this.setState({ isTermsModalOpen: true, isSubscribeModalOpen: true });
		// switch (modalType) {
		// 	case 'terms':
		// 		this.setState({ isTermsModalOpen: true });
		// 		break;
		// 	case 'subscribe':
		// 		this.setState({ isSubscribeModalOpen: true });
		// }
	};

	onAddCrossSale = optionId => {
		const { resultId, request } = this.props;
		this.props.toggleCrossSale('add', resultId, request.id, optionId);
	};

	onRemoveCrossSale = optionId => {
		const { resultId, request } = this.props;
		this.props.toggleCrossSale('remove', resultId, request.id, optionId);
	};

	onAddTourist = () => {
		this.props.resetCrossSales();
	};

	onRemoveTourist = tourist => {
		this.props.resetCrossSales();
		setTimeout(() => {
			this.recalculatePolicy();
		});
	};

	onBirthDatesChange = () => {
		this.props.resetCrossSales();
		setTimeout(() => {
			this.recalculatePolicy();
		});
	};

	onSubmit = ({ insuredList, insurer }) => {
		const { resultId, company, priceValue, isPaymentProcessing } = this.props;
		if (isPaymentProcessing) {
			return;
		}
		const [lastName, firstName, ...patronymic] = insurer.name.split(' ');
		const { birthDate, email, phone, passport } = insurer;
		const data = {
			insuredList,
			insurer: {
				firstName,
				lastName,
				patronymic: patronymic.join(' '),
				birthDate,
				email: email.split(' ').join(''),
				phone: phone.replace(/\s/g, ''),
			},
			subscribe: this.state.subscribeAgree
		};
		if (passport) {
			data.insurer.passport = passport;
		}
		return this.props.payOrder(resultId, data);
	};

	openConfirmSubscribeModal = e => {
		const { company } = this.props;
		e.stopPropagation();
		this.props.showConfirmSubscribeModal(company);
	};

	openConfirmTermsModal = e => {
		const { company } = this.props;
		e.stopPropagation();
		this.props.showConfirmTermsModal(company);
	};

	recalculatePolicy = (refreshCrossSales = true) => {
		const { resultId } = this.props;
		if (refreshCrossSales) {
			this.props.resetCrossSales();
		}
		this.props.recalculateResult(resultId, refreshCrossSales);
	};

	get tourists() {
		const { containerQuery } = this.props;
		return (
			<div>
				<h4 className="text-size-4 text-weight-bold margin-bottom-medium">
					Туристы (застрахованные)
				</h4>
				<FieldArray
					name="insuredList"
					component={ renderTourists }
					onAddTourist={ this.onAddTourist }
					onRemoveTourist={ this.onRemoveTourist }
					onBirthDatesChange={ this.onBirthDatesChange }
					containerQuery={ containerQuery }
				/>
			</div>
		);
	}

	get buyer() {
		const { priceValue, company: { code: company_code }, containerQuery: { xs, sm, md } } = this.props;
		const sectionCls = cx(
			'flexbox',
			'margin-bottom-default',
			{
				'flexbox--vert': xs,
				'flexbox--gap_small': xs,
				'flexbox--row': sm || md,
				'flexbox--gap_medium': sm || md,
			},
		);
		return (
			<div>
				<h4 className="text-size-4 text-weight-bold margin-bottom-medium">
					Покупатель полиса
				</h4>
				<FormSection name="insurer">
					<div className={ sectionCls }>
						<div className="flexbox__item">
							<Field
								id="insurerName"
								name="name"
								label={ `Ф.И.О. (${company_code === 'vsk' ? 'латиницей' : 'кириллицей'})` }
								component={ TextField }
								floatingLabel
							/>
						</div>
						<div className={ cx(s.date, 'flexbox__item', 'flexbox__item--min') }>
							<Field
								id="birthDate"
								name="birthDate"
								label="Дата рождения"
								component={ InputDateField }
								startDate={ '1987-08-22' }
								endDate={ '2030-05-22' }
								maxDate={ maxBirthDate }
								editable={ true }
								floatingLabel
							/>
						</div>
					</div>
					{ company_code === 'capitallife' && priceValue >= capitalLifeLimit &&
						<Fragment>
							<div className={ sectionCls }>
								<div className="flexbox__item">
									<Field
										id="insurerPassportSeries"
										name="passport.series"
										component={ PassportSeriesField }
										floatingLabel
									/>
								</div>
								<div className="flexbox__item">
									<Field
										id="insurerPassportNumber"
										name="passport.number"
										component={ PassportNumberField }
										floatingLabel
									/>
								</div>
								<div className="flexbox__item">
									<Field
										id="insurerPassportIssuerCode"
										name="passport.issueOrganizationCode"
										component={ PassportIssuerCodeField }
										floatingLabel
									/>
								</div>
								<div className={ cx(s.date, 'flexbox__item', 'flexbox__item--min') }>
									<Field
										id="insurerPassportIssueDate"
										name="passport.issueDate"
										label="Дата выдачи"
										component={ InputDateField }
										editable={ true }
										floatingLabel
									/>
								</div>
							</div>
							<div className={ sectionCls }>
								<div className="flexbox__item">
									<Field
										id="insurerPassportIssuer"
										name="passport.issueOrganization"
										label="Кем выдан"
										component={ TextField }
										floatingLabel
									/>
								</div>
							</div>
						</Fragment>
					}
					<div className={ sectionCls }>
						<div className="flexbox__item">
							<Field
								id="email"
								name="email"
								label="Электронная почта"
								component={ TextField }
								hint="На указанную почту вы получите полис и квитанцию об оплате"
								floatingLabel
							/>
						</div>
						<div className="flexbox__item">
							<Field
								id="phone"
								name="phone"
								label="Телефон"
								component={ PhoneField }
								floatingLabel
							/>
						</div>
					</div>
				</FormSection>
				<div className="margin-top-default">
					<PolicyPrice
						price={ this.props.price }
						isRecalculating={ this.props.isRecalculating }
					/>
				</div>
				{this.crossSales}
			</div>
		);
	}

	get crossSales() {
		const {
			crossSales,
			isBirthDatesFilled,
			containerQuery,
		} = this.props;
		const { xs } = containerQuery;

		// TODO: Display spinner/loader
		if (!(crossSales && crossSales.length)) {
			return null;
		}

		if (!isBirthDatesFilled) {
			return null;
		}

		return (
			<div className="padding-bottom-x-small">
				<h4 className="text-size-4 text-weight-bold margin-top-default margin-bottom-default">
					Рекомендуем улучшить полис
				</h4>
				<Field
					name="crossSales"
					component={ CrossSalesField }
					crossSales={ crossSales }
					onAddCrossale={ this.onAddCrossSale }
					onRemoveCrossale={ this.onRemoveCrossSale }
					isMobile={ xs }
				/>
			</div>
		);
	}

	get confirmSubscribeTitle() {
		const { company } = this.props;
		return (
			<div>
				Я соглашаюсь c <Link onClick={ this.openConfirmTermsModal } type="pseudo">условиями передачи данных</Link>, получением <Link onClick={ this.openConfirmSubscribeModal } type="pseudo">рассылок</Link> и
				{ company.insuranceRulesWebPath ? (<Link onClick={ e => e.stopPropagation() } href={ company.insuranceRulesWebPath } target="_blank" type="pseudo"> правилами страхования</Link>) :
					(<span> правилами страхования</span>)}
			</div>
		);
	}

	get actions() {
		const {
			submitting,
			isRecalculating,
			isPaymentProcessing,
			containerQuery: { xs, md }
		} = this.props;
		const { termsAgree, subscribeAgree } = this.state;
		const cls = cx({
			'padding-left-x-small padding-right-x-small padding-bottom-x-small': md,
		});

		return (
			<div>
				<div className="flexbox flexbox--vert flexbox--gap_small">
					{/*<div className="flexbox flexbox__item">*/}
					{/*	<Checkbox*/}
					{/*		title={ this.confirmTermsTitle }*/}
					{/*		checked={ termsAgree }*/}
					{/*		changeHandler={ this.toggleConfirm('terms') }*/}
					{/*	/>*/}
					{/*</div>*/}
					<div className="flexbox flexbox__item">
						<Checkbox
							title={ this.confirmSubscribeTitle }
							checked={ subscribeAgree }
							changeHandler={ this.toggleConfirm('subscribe') }
						/>
					</div>
					<div className="flexbox flexbox__item">
						<Button
							type="submit"
							size="large"
							disabled={ isRecalculating || !subscribeAgree }
							isLoading={ submitting || isPaymentProcessing }
							fullWidth={ xs }
						>
							Оплатить
						</Button>
					</div>
				</div>
			</div>
		);
	}

	render() {
		const { handleSubmit, containerQuery: { xs, sm, md } } = this.props;
		const classNames = cx(
			s.root,
			{
				[s.root_xs]: xs,
				[s.root_sm]: sm,
				[s.root_md]: md,
			},
		);
		return (
			<form
				className={ classNames }
				onSubmit={ handleSubmit(this.onSubmit) }
			>
				<Panel
					header="Оформление полиса"
					sections={ [
						this.tourists,
						this.buyer,
						this.actions,
					] }
				/>
			</form>
		);
	}
}

function mapStateToProps(state, { request }) {
	return {
		initialValues: {
			insuredList: new Array(request.insuredCount).fill({}),
			crossSales: [],
		},
		isFetchingCrossSales: isFetchingCrossSalesSelector(state),
		isPaymentProcessing: isPaymentProcessingSelector(state),
		isBirthDatesFilled: isBirthDatesFilledSelector(state),
		crossSales: crossSalesSelector(state),
		tourists: insuredListFormValueSelector(state),
		priceValue: priceValueSelector(state),
		price: totalSumSelector(state, true),
	};
}

export default connect(mapStateToProps, {
	payOrder,
	fetchCrossSales,
	toggleCrossSale,
	resetCrossSales,
	showConfirmSubscribeModal,
	showConfirmTermsModal,
	recalculateResult,
})(
	reduxForm({
		form: PURCHASE_FORM_NAME,
		validate,
	})(
		applyContainerQuery(PurchaseForm, query),
	),
);
