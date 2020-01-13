import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import {
	IconButton,
	Button,
	Link,
	ExpansionPanel,
	TextList,
	SearchResultsList,
	GridWrapper,
	GridRow,
	GridCol,
	Tooltip,
} from 'react-ui-2018';
import { getPluralForm, moneyFormat } from 'helpers';
import { formatSum } from '../../helpers';
import { scrollToRef } from '../../utils/utils';
import {
	companyType,
	calculationResult,
} from '../../types';
import { companySelector } from '../../redux/modules/companies';
import { packageSelector } from '../../redux/modules/packages';
import {
	makeFranchiseSumSelector,
	makeInsuranceAmountSelector,
} from '../../redux/modules/results';
import { showGuaranteedOptionsModal } from '../../redux/modules/modals';

import OptionsList from '../OptionsList/OptionsList';

import s from './SearchListItem.module.styl';
import {
	aff_sub3Selector,
	hoSourceSelector,
	userRegionIdSelector
} from '../../redux/modules/runtime';

import { getPurchaseLink } from '../../helpers';
import {
	sendOtherPackagesClickAction,
	sendPackageDetailViewAction
} from '../../redux/modules/results/actions';
import { renderRatingTooltip, renderAssistanceTooltip } from './partials';

const getShowChildrenLabel = itemsCount =>
	`Еще ${getPluralForm(itemsCount, ['полис', 'полиса', 'полисов'])}`;

class SearchListItem extends Component {
	static propTypes = {
		result: calculationResult.isRequired,
		company: companyType.isRequired,
		insuranceAmount: T.string,
		franchiseSum: T.string,
		childItems: T.arrayOf(calculationResult),
		child: T.bool,
		showGuaranteedOptionsModal: T.func,
		hoParams: T.shape,
		sendPackageDetailViewAction: T.func,
		sendOtherPackagesClickAction: T.func,
		containerQuery: T.shape({
			/** Ширина контейнера до 503px */
			xs: T.bool,
			/** Ширина контейнера от 504px до 703px */
			sm: T.bool,
			/** Ширина от 704px и выше */
			md: T.bool
		})
	};

	static defaultProps = {
		insuranceAmount: '',
		franchiseSum: '',
		childItems: [],
		child: false,
		showGuaranteedOptionsModal: () => {},
		sendPackageDetailViewAction: () => {},
		sendOtherPackagesClickAction: () => {},
	};

	onPackageDetailToggle = (isOpened, panelRef) => {
		const {
			company: { code: companyCode },
			'package': { id: packageId },
			containerQuery: { xs, sm },
			sendPackageDetailViewAction
		} = this.props;
		if (isOpened) {
			sendPackageDetailViewAction(companyCode, packageId);
			// Скроллим до элемента на мобильных устройствах
			if (xs || sm) {
				scrollToRef(panelRef);
			}
		}
	};

	onOtherPackagesToggle = (isOpened, panelRef) => {
		const {
			company: { code: companyCode },
			sendOtherPackagesClickAction,
			containerQuery: { xs, sm },
		} = this.props;
		if (isOpened) {
			sendOtherPackagesClickAction(companyCode);
			// Скроллим до элемента на мобильных устройствах
			if (xs || sm) {
				scrollToRef(panelRef);
			}
		}
	};

	onPurchaseButtonClick = (e) => {
		e.stopPropagation();
		const company = this.props.company.code;
		pushGtmEvent('VZR_SERVIS', 'click_button_oformit_online', company, undefined); // событие на клик “оформить онлайн”
	};

	get price() {
		const {
			result,
			containerQuery: { xs, sm },
			franchiseSum
		} = this.props;
		if (xs || sm) {
			return (
				<div>
					<div className="text-note margin-bottom-small">Стоимость</div>
					<div className="flexbox flexbox--row flexbox--align-items_baseline">
						<div className="flexbox__item">
							<div className={ cx(s.price, 'text-size-4') }>
								{ moneyFormat(Math.ceil(result.totalSum)) } ₽
							</div>
							<div className="color-minor-black-lighten text-size-7">
								{ franchiseSum }
							</div>
						</div>
						<div className="flexbox__item">
							{ this.optionsTotalAmount > 0 && (
								<div className="text-size-5 color-minor-black-lighten">
									{ getPluralForm(this.optionsTotalAmount, ['опция', 'опции', 'опций']) }
								</div>
							)}
						</div>
					</div>
				</div>
			);
		}
		return (
			<div className={ s.price }>
				<div className="text-size-3">
					{moneyFormat(Math.ceil(result.totalSum))} ₽
				</div>
			</div>
		);
	}

	get suggestionBtnText() {
		const { childItems } = this.props;
		const { showSuggestions } = this.state;
		if (showSuggestions) {
			return 'Скрыть';
		}
		return `Еще ${getPluralForm(childItems.length, ['предложение', 'предложения', 'предложений'])}`;
	}

	get packageInfo() {
		const { containerQuery: { xs, sm, md, lg }, company, result } = this.props;
		return (
			<div>
				<div className={
						cx([
							'text-weight-bold',
							{
								[s.packageName]: lg || md,
								'text-size-5': lg || md,
								'text-size-6 margin-bottom-small': sm || xs
							}
						])
					}
				>
					{this.props.package.name}
				</div>
				{ company.premium && (
					<span className={ s.badge }>
						Премиальная компания
					</span>
				) }
				{ result.discounted && (
					<span className={ cx(s.badge, s.badge_discount) }>
						Есть скидка!
					</span>
				) }
			</div>
		);
	}

	get purchaseButton() {
		const {
			company,
			'package': { id: package_id },
			containerQuery: { xs, sm },
			result,
			hoParams
		} = this.props;
		const trackingLink = getPurchaseLink(company.code, {
			source: hoParams.hoSource,
			aff_sub2: hoParams.userRegionId,
			aff_sub3: hoParams.aff_sub3,
			aff_sub4: result.id,
			aff_sub5: package_id,
			params: result.id
		});
		const link = banki.env.envValue === 'production' && trackingLink ? trackingLink : `/insurance/order/tourism/${company.code}/purchase/${result.id}/`;
		return (
			<Button
				theme="orange"
				href={ link }
				onClick={ this.onPurchaseButtonClick }
				size="medium"
				fullWidth={ xs || sm }
				isInTable
			>
				Оформить онлайн
			</Button>
		);
	}

	get desktopSummary() {
		const { company, franchiseSum, isParent } = this.props;
		return (
			<GridRow>
				<GridCol xs={ 1 } sm={ 3 } md={ 4 } lg={ 4 } xl={ 6 }>
					<div className="flexbox flexbox--row flexbox--gap_small">
						<div className="flexbox__item flexbox__item--min">
							<div className={ s.logo }>
								{ isParent && (
									<img
										src={ company.logo }
										alt={ company.name }
									/>
								)}
							</div>
						</div>
						<div className="flexbox__item">
							{ this.packageInfo }
						</div>
					</div>
				</GridCol>
				<GridCol xs={ 1 } sm={ 2 } md={ 3 } lg={ 3 } xl={ 3 } xsAlign="baseline">
					{ this.price }
					<div className="color-minor-black-lighten text-size-6">
						{ franchiseSum }
					</div>
				</GridCol>
				<GridCol xs={ 1 } sm={ 1 } md={ 2 } xl={ 3 } xsAlign="baseline">
					<div className={ s.options }>
						{
							this.optionsTotalAmount > 0 &&
							getPluralForm(this.optionsTotalAmount, ['опция', 'опции', 'опций'])
						}
					</div>
				</GridCol>
				<GridCol xs={ 1 } sm={ 2 } md={ 3 } xl={ 4 } xsAlign="baseline">
					<div className="flexbox flexbox--row flexbox--justify-content_flex-end flexbox--align-items_baseline">
						<div className="flexbox__item" />
						<div className="flexbox__item flexbox__item--min">
							{ this.purchaseButton }
							<div className="text-size-7 text-align-right color-minor-black-lighten margin-top-x-small-fixed">
								Доставка на email
							</div>
						</div>
					</div>
				</GridCol>
			</GridRow>
		);
	}

	get mobileSummary() {
		const { company } = this.props;
		return (
			<div>
				<div className="flexbox flexbox--row flexbox--gap_medium">
					<div className="flexbox__item">
						{ this.packageInfo }
					</div>
					<div className="flexbox__item flexbox__item--min">
						<div className={ cx(s.logo, s.logo_mobile) }>
							<img
								src={ company.logo }
								alt={ company.name }
							/>
						</div>
					</div>
				</div>
				<div className="margin-top-default">
					<div className="flexbox--row">
						{ this.price }
					</div>
				</div>
				<div className="margin-top-small-fixed">
					{ this.purchaseButton }
					<div className="text-size-7 text-align-center color-minor-black-lighten margin-vert-x-small-fixed">
						Доставка на email
					</div>
				</div>
			</div>
		);
	}

	get summary() {
		const {
			containerQuery: { xs, sm },
			company,
			franchiseSum,
			isParent,
		} = this.props;

		if (xs || sm) {
			return this.mobileSummary;
		}
		return this.desktopSummary;
	}

	get desktopDetails() {
		const { company, insuranceAmount, result } = this.props;
		return (
			<GridRow>
				<GridCol xs={ 2 } sm={ 3 } md={ 4 } lg={ 4 } xl={ 6 }>
					<div className="text-size-5 margin-bottom-small">
						{ company.officialName }
					</div>
					{ company.rating && (
						<div className="flexbox flexbox--row flexbox--align-items_center margin-bottom-small">
							<div className="flexbox__item flexbox__item--min">
								Рейтинг: { company.rating }
							</div>
							<div className="margin-left-x-small-fixed flexbox__item flexbox__item--min">
								{renderRatingTooltip()}
							</div>
						</div>
					) }
					<div className="margin-bottom-small">
						Страховая сумма: { insuranceAmount }
					</div>
					{ result.assistanceCompanies.map((i, index) => (
						<div key={ i.name }>
							<span className="margin-right-x-small-fixed">
								{index === 0 && 'Ассистанс: '}
								{i.name}
							</span>
							{renderAssistanceTooltip()}
						</div>
					)) }
					<div className="margin-top-small">
						<Link leftIcon="doc-pdf" href={ company.insuranceRulesWebPath } target="_blank">
							Правила страхования
						</Link>
					</div>
				</GridCol>
				<GridCol xs={ 2 } sm={ 5 } md={ 8 } lg={ 8 } xl={ 10 }>
					{ this.optionsList }
				</GridCol>
			</GridRow>
		);
	}

	get mobileDetails() {
		const { company, insuranceAmount, result } = this.props;
		return (
			<div>
				<div className="text-size-5 margin-bottom-medium">
					{ company.officialName }
				</div>
				{ company.rating && (
					<div className="text-size-6 margin-bottom-medium">
						<div>
							<span className="margin-right-x-small-fixed">
								<span className="text-note text-size-7">Рейтинг:</span> { company.rating }
							</span>
							{ renderRatingTooltip() }
						</div>
					</div>
				)}
				<div className="text-size-6 margin-bottom-medium">
					<span className="text-note text-size-7">Страховая сумма:</span> { insuranceAmount }
				</div>
				<div className="text-size-6">
					{ result.assistanceCompanies.map((i, index) => (
						<div key={ i.name }>
							<span className="margin-right-x-small-fixed">
								{ index === 0 && <span className="text-note text-size-7">Ассистанс: </span> }
								{ i.name }
							</span>
							{ renderAssistanceTooltip() }
						</div>
					))}
				</div>
				<div className="margin-top-default" style={ { marginLeft: -3 } }>
					<Link
						leftIcon="doc-pdf"
						href={ company.insuranceRulesWebPath }
						target="_blank"
						size="small"
					>
						Правила страхования
					</Link>
				</div>
				<div className="margin-top-medium-fixed">
					{ this.optionsList }
				</div>
			</div>
		);
	}

	get details() {
		const {
			containerQuery: { xs, sm },
		} = this.props;
		if (xs || sm) {
			return this.mobileDetails;
		}
		return this.desktopDetails;
	}

	get companyOptions() {
		const { result } = this.props;
		return result.companyOptions.map(option => {
			let suffix = '';
			if (option.franchise) {
				suffix = option.franchiseInPercentage
					? ` (франшиза ${option.franchise}%)`
					: ` (франшиза ${formatSum(option.franchise, result.insuranceAmountCurrency)})`;
			}
			return {
				name: (
					<Fragment>
						<span className="margin-right-x-small">{ option.name } { suffix }</span>&nbsp;
						{ option.comment && (
							<Tooltip
								content={ option.comment }
								position="top"
								trigger="mouseenter"
							>
								<IconButton icon="info" size="medium" />
							</Tooltip>
						)}
					</Fragment>
				),
			};
		});
	}

	get guaranteedOptions() {
		const { result } = this.props;
		return result.guaranteedOptions.map(option => {
			return {
				name: (
					<Fragment>
						<span className="margin-right-x-small">{option.name}</span>&nbsp;
						{ option.comment && (
							<Tooltip
								content={ option.comment }
								position="top"
								trigger="mouseenter"
							>
								<IconButton icon="info" size="medium" />
							</Tooltip>
						) }
					</Fragment>
				)
			};
		});
	}

	get optionsTotalAmount() {
		return this.companyOptions.length + this.guaranteedOptions.length;
	}

	get optionsList() {
		if (!this.companyOptions) {
			return null;
		}
		return (
			<div>
				<h3 className="text-size-5 text-weight-bold margin-bottom-medium">
					Гарантированные риски
				</h3>
				<OptionsList
					options={ this.guaranteedOptions }
				/>
				{ this.companyOptions.length > 0 && (
					<Fragment>
						<h3 className="text-size-5 text-weight-bold margin-top-default margin-bottom-medium">
							Дополнительные риски
						</h3>
						<OptionsList
							options={ this.companyOptions }
						/>
					</Fragment>
				) }
			</div>
		);
	}

	get childItems() {
		const { childItems } = this.props;
		return childItems.map((item, idx) => (
			<SearchListItemWrapper
				key={ item.id }
				result={ item }
				isLastChild={ childItems.length === idx + 1 }
				containerQuery={ this.props.containerQuery }
				child
			/>
		));
	}

	render() {
		const { company, child } = this.props;
		// Рекурсивно выводим элементы списка
		return (
			<SearchResultsList.Item
				summary={ this.summary }
				details={ this.details }
				child={ this.props.child }
				getShowChildrenLabel={ getShowChildrenLabel }
				className={ s.root }
				expandedClassName={ s.root_expanded }
				onPanelToggle={ this.onPackageDetailToggle }
				onChildrenToggle={ this.onOtherPackagesToggle }
				premium={ !child && company.premium }
			>
				{this.childItems}
			</SearchResultsList.Item>
		);
	}
}

function mapStateToProps(state, { result }) {
	const insuranceAmountSelector = makeInsuranceAmountSelector();
	const franchiseSumSelector = makeFranchiseSumSelector();
	return {
		company: companySelector(state, result.company),
		'package': packageSelector(state, result.package),
		insuranceAmount: insuranceAmountSelector(state, result),
		franchiseSum: franchiseSumSelector(state, result),
		hoParams: {
			hoSource: hoSourceSelector(state),
			userRegionId: userRegionIdSelector(state),
			aff_sub3: aff_sub3Selector(state)
		}
	};
}

const SearchListItemWrapper = connect(mapStateToProps, {
	showGuaranteedOptionsModal,
	sendPackageDetailViewAction,
	sendOtherPackagesClickAction,
})(SearchListItem);

export default SearchListItemWrapper;
