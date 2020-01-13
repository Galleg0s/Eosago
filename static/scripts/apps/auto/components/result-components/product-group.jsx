var React = require('react');
var ProductRow = require('./product-row.jsx');
var Options = require('./product-options.jsx');
var ResultStore = require('../../stores/result-store.js');
var router = require('router');
var classNames = require('classnames');
import { Icon, Link } from 'react-ui';

class ProductGroup extends React.Component {
	constructor(props) {
		super(props);
		this._trackCompanyVisit = this._trackCompanyVisit.bind(this)
	}
	_trackCompanyVisit() {
		ResultStore.registerCompanyVisit(this.props.result.company.id);
	}

	toggleHandler(event) {
		const target = event.target;
		const toggleWrap = target.closest('[data-toggle]');
		const toggleContent = toggleWrap.querySelector('[data-toggle-content]');
		const toggleIcon = toggleWrap.querySelector('.icon-font');
		const toggleHandler = toggleWrap.querySelector('.toggle-handler');
		toggleContent.classList.toggle('is-hidden');
		toggleIcon.classList.toggle('icon-arrow-down-16');
		toggleIcon.classList.toggle('icon-arrow-top-16');
		toggleHandler.classList.toggle('expanded');
	}

	render() {
		var self = this;
		var productsGrouped = [];
		var Products;

		if (this.props.types && this.props.types.kasko && this.props.result.products.kasko.length) {
			this.props.result.products.kasko.forEach(function(product, index) {
				product = {
					id: product.id,
					first: index === 0,
					kasko: product,
					osago: self.props.result.products.osago ? self.props.result.products.osago : null,
					lead: self.props.result.leads[product.id] ||
							self.props.result.leads[self.props.result.products.osago ? self.props.result.products.osago.id : 0],
					leadOptions: product.options
				};

				productsGrouped.push(product);

				if (product.kasko.baseAttribute.length) {
					productsGrouped.push({
						id: product.id,
						options: product.kasko.baseAttribute
					});
				}
			});

			Products = productsGrouped.map(function(product) {
				if (product.options) {
					return (
						<Options
							key={ self.props.result.company.id + ':' + product.id }
							options={ product.options }
							id={ product.id }
							isActiveOptions={ self.props.isActiveOptions.bind(self, product.id) }
							toggleOptions={ self.props.toggleOptions.bind(self, product.id) }
						/>
					);
				} else {
					return (
						<ProductRow
							key={ product.id }
							types={ self.props.types }
							result={ self.props.result }
							product={ product }
							updateCompare={ self.props.updateCompare }
							toggleOptions={ self.props.toggleOptions.bind(self, product.id) }
						/>
					);
				}
			});
		} else {
			var product = {
				id: self.props.result.products.osago.id,
				first: true,
				kasko: {},
				osago: self.props.result.products.osago,
				lead: this.props.result.leads[self.props.result.products.osago.id],
				leadOptions: self.props.result.products.osago.options
			};

			Products = (
				<ProductRow
					types={ self.props.types }
					result={ self.props.result }
					confirmedResult={ self.props.confirmedResult }
					product={ product }
					updateCompare={ self.props.updateCompare }
					resultType={ self.props.resultType }
				/>
			);
		}

		const companyLogoImage = (
			<img
				width="100%"
				src={ this.props.result.company.logo || require('../../../../../images/default_logo.png') }
				alt={ this.props.result.company.name }
				title={ this.props.result.company.name }
			/>
		);

		const companyLogoLink = (
			<a href={ router.generate('bankiru_insurance_company', {company: this.props.result.company.url}) } target="_blank" onClick={ this._trackCompanyVisit }>
				{ companyLogoImage }
			</a>
		);

		const companyLabel = this.props.result.company.is_special_premium &&
			<div className="company-tag">
				<span className="company-tag__text">
					{ this.props.result.company.is_special_premium && this.props.result.company.special_premium_text }
				</span>
			</div>;

		return (
			<div
				className={ classNames(
					'product-group',
					'border-dark-gray',
					'position-relative',
					{ 'product-group--disabled': this.props.resultType === 5 && this.props.confirmedResult && !this.props.confirmedResult.length },
					{
						'bg-sponsor': this.props.result.company.is_special_premium,
						'product-group--tagged': this.props.result.company.is_special_premium || this.props.result.company.premium
					}
				) }
				data-test={ 'auto-result-company-' + this.props.result.company.id }
			>
				{ companyLabel }
				<div className="grid__row">
					<div className="grid__cell grid__cell--min hidden--md-down">
						<div className="insurance-company-logo padding-left-default padding-top-default">
							{ this.props.result.company.showLogo &&
							!ResultStore.getWidgetId() ? companyLogoLink : companyLogoImage
							}
						</div>
					</div>
					<div className="grid__cell">
						{ Products }
					</div>
				</div>
				{ this.props.resultType === 5 && (
					<div data-toggle>
						<div className="text-align-center">
							<div className="toggle-handler" onClick={ this.toggleHandler }>
								<span className="toggle-handler-text text-uppercase">Подробнее</span>
								<Icon name="arrow-down" color="gray" className="margin-left-xx-small" />
							</div>
						</div>
						<div className="flexbox is-hidden bg-white-2-gray padding-default" data-toggle-content>
							<div className="flexbox__item flexbox__item--min hidden--md-down toggle-content-left padding-left-default"></div>
							<div className="flexbox__item">
								<ul className="text-list text-list--bullet--orange">
									<li>Оплата напрямую в страховую компанию</li>
									<li>Без комиссии</li>
									<li>Доставка договора на e-mail</li>
									<li>Гарантия подлинности полиса</li>
								</ul>
							</div>
						</div>
					</div>
				) }
			</div>
		)
	}
}

module.exports = ProductGroup;
