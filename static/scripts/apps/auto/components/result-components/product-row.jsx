var $ = require('jquery');
var forEach = require('lodash/forEach');
var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('../../dispatcher/dispatcher.js');
var FormStore = require('../../stores/form-store.js');
var ResultStore = require('../../stores/result-store.js');
var UserStore = require('../../stores/user-store.js');
var PriceKasko = require('./price-kasko.jsx');
var CircleStat = require('ui.circle-stat');
var Tooltip = require('ui.tooltip');
var Compare = require('../../../../_common/utils/compare-storage.js');
var Helpers = require('helpers');
var classNames = require('classnames');
var router = require('router');
var CompareButton = require('./compare-button.jsx');
var LeadOption = require('./lead-option.jsx');
import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';
import {
	INGOS_COMPANY_ID,
	ALFA_COMPANY_ID,
	ALFA_PLUS_COMPANY_ID,
	RGS_COMPANY_ID,
	TINKOFF_COMPANY_ID,
	SOGLASIE_COMPANY_ID,
	NASKO_COMPANY_ID,
	gaCategory,
} from '../../../e-osago/constants';
import Hash from '../../../../_common/utils/hash';

class ProductRow extends React.Component {
	constructor(props) {
		super(props);
		var statColors = FormStore.getStatColors();
		var widgetId = ResultStore.getWidgetId();
		this.state = {
			statColors: statColors,
			productAvailable: this.props.product.kasko && this.props.product.kasko.isCardShow,
			inCompare: this._checkCompare(this.props),
			widgetMode: widgetId
		};
		this._updateCompare = this._updateCompare.bind(this);
		this._initTooltip = this._initTooltip.bind(this);
		this._updateCompare = this._updateCompare.bind(this);
		this._addToCompare = this._addToCompare.bind(this);
		this._deleteFromCompare = this._deleteFromCompare.bind(this);
		this._onLeadClick = this._onLeadClick.bind(this);
		this._onEOsagoClick = this._onEOsagoClick.bind(this);
		this._trackCompanyVisit = this._trackCompanyVisit.bind(this);
		this._componentWillMount()
	}

	_componentWillMount() {
		ResultStore.addCompareUpdateListener(this._updateCompare);
	}

	componentWillUnmount() {
		ResultStore.removeCompareUpdateListener(this._updateCompare);
	}

	componentDidMount() {
		if (this.props.types && this.props.types.kasko) {
			this._initCircleStat();
		}

		this._initTooltip();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			productAvailable: nextProps.product.kasko && nextProps.product.kasko.isCardShow,
			inCompare: this._checkCompare(nextProps)
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (!prevState.productAvailable && this.state.productAvailable) {
			this._initTooltip();
		}

		if (this.state.productAvailable &&
			this.props.product.kasko.rating !== prevProps.product.kasko.rating) {


			this._initCircleStat();
		}
	}

	_initCircleStat() {
		var ratingElement = ReactDOM.findDOMNode(this).querySelector('[data-rating]');

		var rating = this.props.product.kasko.rating;
		rating = rating ? Math.round(rating / 10) : 0;

		var options = {
			size: 54,
			color: this.state.statColors[rating],
			value: rating * 10,
			label: rating,
			animate: true
		};

		if (ratingElement) {
			try {
				new CircleStat(ratingElement, this.props.product.kasko ? options : {value: 0});
			} catch (e) {
				console.warn(e);
			}
		}
	}

	_initTooltip() {
		var tooltipsSpecialOffer = ReactDOM.findDOMNode(this).querySelectorAll('.special-offer [data-tooltip]');

		forEach(tooltipsSpecialOffer, function(item) {
			new Tooltip($(item), {
				placement: 'top',
				content: item.getAttribute('data-tooltip'),
				trigger: 'hover focus'
			});
		});
	}

	_checkCompare(props) {
		return props.product.kasko && props.product.kasko.id ? Compare.isInCompare(props.product.kasko.id) : null;
	}

	_updateCompare() {
		this.setState({
			inCompare: this._checkCompare(this.props)
		});
	}

	_addToCompare() {
		Compare.add(1, this.props.product.kasko.id);

		this.setState({inCompare: true});
		this.props.updateCompare();
	}

	_deleteFromCompare() {
		Compare.delete(this.props.product.kasko.id);

		this.setState({inCompare: false});
		this.props.updateCompare();
	}

	_getFormatedMoney(sum) {
		return Helpers.moneyFormat(sum);
	}

	_onLeadClick(lead) {
		this._trackCompanyVisit();

		AppDispatcher.dispatch({
			action: 'LEAD_CLICK',
			data: lead
		});
	}

	_getOfferIdForHO(offerId) {

		const offerIds = {
			[INGOS_COMPANY_ID]: 2301,        //  Ингосстрах (companyId : offerId)
			[ALFA_COMPANY_ID]: 2299,         //  АльфаСтрахование
			[ALFA_PLUS_COMPANY_ID]: 2299,    //  АльфаСтрахование ПЛЮС
			[TINKOFF_COMPANY_ID]: 3691,      //  Тинькофф
			[RGS_COMPANY_ID]: 3729,          //  РГС
			[SOGLASIE_COMPANY_ID]: 3845,     //  Согласие
			[NASKO_COMPANY_ID]: 3898,        //  НАСКО
		};

		return offerIds[offerId];
	}

	_getUrlIdForHO(urlId) {

		const urlIds = {
			[INGOS_COMPANY_ID]: 3427,        //  Ингосстрах (companyId : urlId)
			[ALFA_COMPANY_ID]: 3425,         //  АльфаСтрахование
			[ALFA_PLUS_COMPANY_ID]: 3425,    //  АльфаСтрахование ПЛЮС
			[TINKOFF_COMPANY_ID]: 5833,      //  Тинькофф
			[RGS_COMPANY_ID]: 5915,          //  РГС
			[SOGLASIE_COMPANY_ID]: 6193,     //  Согласие
			[NASKO_COMPANY_ID]: 6320,        //  НАСКО
		};

		return urlIds[urlId];
	}

	_onEOsagoClick() {
		const confirmedResult = this.props.confirmedResult;
		this._trackCompanyVisit();

		dataLayer.push({ event: 'GTM_event',
			eventCategory: gaCategory,
			eventAction: 'e-OSAGO_offer_click',
			eventLabel: this.props.result.company.name,
			eventValue: undefined
		});

		const regionRegistrationTitle = ResultStore.getResult().data && ResultStore.getResult().data.region_registration && ResultStore.getResult().data.region_registration.title;
		const calculationHash = Hash.get();
		const calculationHashArray = calculationHash && calculationHash.split(':');
		const calculationId = calculationHashArray && calculationHashArray[0];

		const trackingParamsObj = {
			aff_id: 2,
			aff_sub: 'CalcInsurance',
			aff_sub2: regionRegistrationTitle ? regionRegistrationTitle : '',
			aff_sub3: UserStore.getRawCookiesField('aff_sub3'),
			aff_sub4: 'Eosago',
			aff_sub5: calculationId,
			bdp1: UserStore.getRawCookiesField('BANKI_RU_GUEST_ID'),
			source: UserStore.getRawCookiesField('HO_SOURCE'),
			offer_id: this._getOfferIdForHO(this.props.result.company.id),
			url_id: this._getUrlIdForHO(this.props.result.company.id),
		};
		const trackingParamsStr = Helpers.paramObjToStr(trackingParamsObj);

		if (this._getOfferIdForHO(this.props.result.company.id)) {
			const trackingElement = new Image();
			trackingElement.src = `http://tracking.banki.ru/aff_c?${trackingParamsStr}`;
		}

		const kbmStatus = ResultStore.getResult().kbmStatus;

		const eosagoPolicies = ResultStore.getResult().result['5'];

		const checkoutData = {
			id: this.props.result.company.id,
			logo: this.props.result.company.logo,
			name: this.props.result.company.name,
			price: confirmedResult === null ? this.props.product.osago.price : this._getFormatedMoney(confirmedResult[0].premium_sum),
			options: this.props.product.leadOptions,
			eosagoPolicies: eosagoPolicies,
			kbmStatus
		};

		eventEmitter.emit('insurance:e-osago-checkout', UserStore.getData(), checkoutData);
	}

	_trackCompanyVisit() {
		ResultStore.registerCompanyVisit(this.props.result.company.id);
	}

	get productName() {
		if (this.props.product.kasko && this.props.product.kasko.name) {
			return this.props.product.kasko.name
		} else {
			if (this.props.product.osago && this.props.product.osago.name) {
				return this.props.product.osago.name
			} else {
				return 'ОСАГО'
			}
		}
	}

	sendGALEadBtnClick = () => {
		dataLayer.push({ event: 'GTM_event',
			eventCategory: 'INS_Calculator',
			eventAction: `INS_Calculator__result_lead${this.props.product.lead.type}-click`,
			eventLabel: `${this.props.result.company.name} | ${this.productName}`,
			eventValue: undefined
		});
	};

	render() {
		const lead = this.props.product.lead || {};
		const { resultType } = this.props;
		const leadBtnClasses = classNames('button button--size_small display-block', {
			'button--theme_orange': lead && (lead.type === 4 || lead.type === 5 || lead.type === 6) && resultType === 5,
			'button--theme_blue': lead && (lead.type === 4 || lead.type === 5 || lead.type === 6) && resultType !== 5
			// 'button--bordered-orange': !(lead && (lead.type === 4 || lead.type === 5 || lead.type === 6))
		});
		const leadBtnTitle = resultType === 5 ? 'Купить полис' : 'Заказать полис';

		var productLink = this.props.product.kasko && this.props.product.kasko.isCardShow && this.props.product.kasko.productLink ?
							this.props.product.kasko.productLink : router.generate('bankiru_insurance_company', {company: this.props.result.company.url});

		var specialOfferKasko = this.props.product.kasko && this.props.product.kasko.special_offer && !banki.env.isMobileDevice ?
			(
				<div className="special-offer">
					<div className="special-offer__icon" data-tooltip={ this.props.product.kasko.special_offer }></div>
				</div>
			) : null;

		var specialOfferOsago = this.props.product.osago && this.props.product.osago.special_offer && !banki.env.isMobileDevice ?
			(
				<div className="special-offer">
					<div className="special-offer__icon" data-tooltip={ this.props.product.osago.special_offer }></div>
				</div>
			) : null;

		return (
			<div className="product padding-top-default padding-bottom-default margin-left-default margin-right-default margin-top-default"
				data-test="auto-result-company-product"
			>
				<div className="grid__row">
					<div className="grid__cell grid__cell--12 grid__cell--sm flexbox">
						<div className="product__title">
							{ this.state.widgetMode ?
								<div className="widget__link product__company">{ this.props.result.company.name }</div> :
								<a
									href={ productLink }
									target="_blank"
									className="widget__link product__company"
									onClick={ this._trackCompanyVisit }
								>
									{ this.props.result.company.name }
								</a>
							}
							<div className="color-gray-burn product__name">{ this.productName }</div>
						</div>
					</div>

					{ this.props.types && this.props.types.kasko ?
						<div
							className={ classNames('grid__cell grid__cell--12 grid__cell--sm flexbox', {
								'padding-left-large': !banki.env.isMobileDevice
							}) }
						>
							<div className="grid__row">
								<div className="grid__cell grid__cell--sm-12 hidden--md-up product__field">
									Каско
								</div>
								<div className="grid__cell flexbox">
									<div className="grid__row grid__row--v-zero position-relative">
										{ specialOfferKasko }
										<PriceKasko
											price={ this.props.product.kasko.price }
											price_without_discount={ this.props.product.kasko.price_without_discount }
											discount_in_percent={ this.props.product.kasko.discount_in_percent }
										/>

										{ this.props.product.kasko.franchise ?
											<div className="grid__cell grid__cell--12">
												<div className="color-gray-burn franchise">
													франшиза <span className="text-nowrap">{ this._getFormatedMoney(this.props.product.kasko.franchise) } &#8381;</span>
												</div>
											</div>
											:
											null
										}

										{ this.props.product.kasko.baseAttribute && this.props.product.kasko.baseAttribute.length ?
											<div className="grid__cell grid__cell--12 margin-top-auto hidden--sm-down" onClick={ this.props.toggleOptions }>
												<span className="pseudo-link">включено в полис ({ this.props.product.kasko.baseAttribute.length })</span>
											</div> : null
										}
									</div>
								</div>
							</div>
						</div> : null
					}

					{ this.props.types && this.props.types.kasko ?
						<div className="grid__cell hidden--md-down">
							<div className="is-center">
								{ this.state.productAvailable && this.props.product.kasko.rating ?
									<canvas
										data-rating
										width="54"
										height="54"
									></canvas>
									:
									<div>&mdash;</div>
								}
							</div>
						</div> : null
					}

					{ this.props.types && this.props.types.osago ?
						<div className="grid__cell">
							<div className="grid__row">
								<div className="grid__cell grid__cell--sm-12 hidden--md-up product__field">
									ОСАГО
								</div>
								<div className="grid__cell flexbox">
									<div className="grid__row grid__row--v-zero position-relative">
										{ specialOfferOsago }
										<div className="grid__cell grid__cell--12">
											{ this.props.product.osago && this.props.product.osago.price ?
												<div className="header-h3 product__value osago">
													{ !this.props.confirmedResult || !this.props.confirmedResult.length ?
														this.props.product.osago.price :
														this._getFormatedMoney(Math.ceil(this.props.confirmedResult[0].premium_sum)) } &#8381;
												</div> : <div>&mdash;</div>
											}
										</div>
									</div>
								</div>
							</div>
						</div> : null
					}

					<div className="grid__cell grid__cell--12 grid__cell--sm margin-right-auto">
						<div className="grid__row grid__row--v-xs flexbox--vert flexbox--justify-content_flex-end flexbox--gap_xsmall">
							{ lead && (lead.type === 4 || (lead.type === 5 && banki.env.isMobileDevice)) ?
								<div className="flexbox flexbox__item flexbox__item--min flexbox--justify-content_flex-end">
									<a
										className={ leadBtnClasses + ' grid__cell grid__cell--sm-min' }
										href={ lead.info }
										target="_blank"
										onClick={ () => {
											this._trackCompanyVisit();
											this.sendGALEadBtnClick();
										} }
									>
										{ lead.buttonName ? lead.buttonName : leadBtnTitle }
									</a>
								</div> : null
							}

							{ lead && lead.type === 5 && !banki.env.isMobileDevice ?
								<div className="flexbox flexbox__item flexbox__item--min flexbox--justify-content_flex-end">
									<a
										className={ leadBtnClasses + ' grid__cell grid__cell--sm-min' }
										href="javascript:void(0);"
										onClick={ () => {
											this._onLeadClick(lead);
											this.sendGALEadBtnClick();
										} }
									>
										{ lead.buttonName ? lead.buttonName : leadBtnTitle }
									</a>
								</div> : null
							}

							{ lead && lead.type === 6 ?
								<div className="flexbox flexbox__item flexbox__item--min flexbox--justify-content_flex-end">
									<a
										className={ leadBtnClasses + ' grid__cell grid__cell--sm-min' }
										href={ lead.info || 'javascript:void(0);' }
										target={ lead.info ? '_blank' : '_self' }
										onClick={ !lead.info && this._onEOsagoClick.bind(this) }
									>
										{ lead.buttonName ? lead.buttonName : leadBtnTitle }
									</a>
								</div> : null
							}
							<div className="flexbox flexbox__item">
								<div className="grid__row grid__row--v-xs grid__row--h-xs grid__row--align-center grid__row--justify-center">
									<div className="grid__cell hidden--md-down">
										{ this.state.productAvailable && !this.state.widgetMode ?
											<CompareButton
												isInCompare={ this.state.inCompare }
												addHandler={ this._addToCompare }
												removeHandler={ this._deleteFromCompare }
											/> : null
										}
									</div>
									<div className="grid__cell grid__cell--min">
										<div className="grid__row grid__row--h-xs grid__row--justify-center lead-options">
											{ this.props.product.leadOptions && this.props.product.leadOptions.length ?
												this.props.product.leadOptions.map((leadOption, index) =>
													<LeadOption key={ index } image={ leadOption.image } content={ leadOption.tooltip } />
												) : null
											}
										</div>
										{ this.props.product.kasko.baseAttribute && this.props.product.kasko.baseAttribute.length ?
											<div className="grid__cell grid__cell--12 margin-top-auto hidden--sm-up" onClick={ this.props.toggleOptions }>
												<span className="pseudo-link font-size-medium">включено в полис ({ this.props.product.kasko.baseAttribute.length })</span>
											</div> : null
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = ProductRow;
