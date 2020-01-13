import React, {Component} from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import qs from 'query-string';
import { applyContainerQuery } from 'react-container-query';
import {
	Button,
	GridWrapper,
	GridRow,
	GridCol,
	TableList,
	Tooltip,
	Icon,
	FadedDropdownPanel,
} from 'react-ui-2018';
import {
	calculationResult,
	countryType,
	packageType,
	companyType,
} from '../../types';
import OptionsTooltip from '../../components/OptionsTooltip/OptionsTooltip';
import {
	assistanceCompaniesSelector,
	purchasePackageSelector,
	purchaseInsuranceAmountSelector,
	durationSelector,
	franchiseSumSelector,
	optionsSelector,
	insuranceAmountCurrencySelector,
	totalSumSelector,
} from '../../redux/modules/purchase';
import { formatSum } from '../../helpers';
import s from './PurchaseHeader.module.styl';

class PurchaseHeader extends Component {
	static propTypes = {
		assistanceCompanies: T.arrayOf(T.shape()),
		options: T.arrayOf(T.shape()),
		currency: T.string,
		franchise: T.string,
		price: T.string.isRequired,
		insuranceAmount: T.string.isRequired,
		result: calculationResult.isRequired,
		'package': packageType.isRequired,
		countries: T.arrayOf(countryType).isRequired,
		company: companyType.isRequired,
		status: T.string,
		searchUrl: T.string,
		hasSchengen: T.bool,
		containerQuery: T.shape({
			md: T.bool,
			xs: T.bool,
		}).isRequired
	};

	static defaultProps = {
		currency: 'USD',
		status: 'purchase',
		searchUrl: '',
		hasSchengen: false,
		franchise: null,
		options: [],
	};

	get countries() {
		const { countries } = this.props;
		return countries.map(country => country.name).join(', ');
	}

	get options() {
		const { options, currency } = this.props;
		return options
			.map(option => {
				let suffix = '';
				if (option.franchise) {
					suffix = option.franchiseInPercentage
						? ` (франшиза ${option.franchise}%)`
						: ` (франшиза ${formatSum(option.franchise, currency)})`;
				}
				return {
					name: `${option.name}${suffix}`
				};
			});
	}

	get changeUrl() {
		const { request, searchUrl } = this.props;
		const { countries, startDate, endDate, options, ages } = request;
		const urlParams = {
			countries,
			startDate,
			endDate,
			options: options.map(item => item.id),
			ages,
		};
		return `${searchUrl}?${qs.stringify(urlParams, { arrayFormat: 'bracket' })}`;
	}

	get changeBtn() {
		const { status, company } = this.props;
		const onClickButton = () => {
			const company = company.code;
			pushGtmEvent('VZR_SERVIS', 'click_button_izmenit_usloviya', company, undefined); // событие на клик “изменить”
		};

		return (
			<div className="text-align-center margin-vert-medium">
				{status === 'order' && (
					<Button
						theme="transparent-dark"
						size="small"
						href={ this.changeUrl }
						onClick={ onClickButton }
					>
						Изменить
					</Button>
				)}
			</div>
		);
	}

	get schengenTip() {
		const { hasSchengen, request } = this.props;
		if (!hasSchengen) {
			return null;
		}
		if (request.yearPolicy) {
			return null;
		}
		return (
			<p className="margin-top-x-small-fixed text-size-6 color-white-alpha-70">
				Срок окончания действия полиса будет увеличен на 15 дней в соответствии с Шенгенскими правилами. Количество застрахованных дней остается неизменным. На стоимость полиса это не повлияет.
			</p>
		)
	}

	get tableList() {
		const {
			containerQuery: { xs, sm, md },
			hasSchengen,
			request,
			assistanceCompanies,
			franchise,
			price,
			insuranceAmount,
			status
		} = this.props;
		return (
			<GridWrapper>
				<GridRow>
					<GridCol
						xs={ 4 }
						mdOffset={ 1 }
						md={ 5 }
						xlOffset={ 2 }
						xl={ 6 }
					>
						<div className="margin-bottom-medium">
							<TableList
								data={ [
									{
										key: 'Стоимость полиса:',
										value: (
											<div>
												{price}{' '}
												<span className="margin-left-small text-size-6 color-white-trans-6">
												{franchise}
											</span>
											</div>
										),
									},
									{
										key: 'Страна поездки:',
										value: this.countries,
									},
									{
										key: 'Страховая сумма:',
										value: insuranceAmount,
									},
								] }
								size={ (xs || sm) ? 'small' : 'medium' }
								valueAlign="left"
								darkTheme
							/>
						</div>
					</GridCol>
					<GridCol xs={ 4 } md={ 5 } xl={ 6 }>
						<div>
							<TableList
								data={ [
									{
										key: 'Ассистанс:',
										value:
											<div>
												{assistanceCompanies.map(i => i.name).join(', ')}
												<Tooltip
													content="Сервисная компания, организующая медицинскую помощь при наступлении страхового случая."
													position="top"
													trigger="mouseenter"
												>
													<span className={ cx(s.optionsIcon, 'margin-left-x-small') }>
														<Icon type="info" size="medium" />
													</span>
												</Tooltip>
											</div>
									},
									{
										key: 'Опции:',
										value: <OptionsTooltip options={ this.options } />,
									},
									{
										key: 'Даты действия:',
										value: this.props.duration,
										comment: !xs && this.schengenTip,
									},
								] }
								size={ (xs || sm) ? 'small' : 'medium' }
								valueAlign="left"
								darkTheme
							/>
						</div>
					</GridCol>
				</GridRow>
				{xs && (
					<GridRow>
						<GridCol xs={ 4 }>
							{this.schengenTip}
						</GridCol>
					</GridRow>
				)}
				<GridRow>
					<GridCol xs={ 4 }>
						{this.changeBtn}
					</GridCol>
				</GridRow>
			</GridWrapper>
		);
	}

	get mobileTableList() {
		const { franchise } = this.props;
		return (
			<FadedDropdownPanel
				maxHeight={ franchise ? 132 : 116 }
				bgColor="dark-blue"
			>
				{this.tableList}
			</FadedDropdownPanel>
		);
	}

	get purchaseInfo() {
		const {
			status,
			containerQuery: { xs, sm },
		} = this.props;
		switch (status) {
			case 'failed':
			case 'successful':
			case 'recalculate':
			case 'not_available':
				return null;
			default:
				break;
		}

		if (xs || sm) {
			return this.mobileTableList;
		}
		return this.tableList;
	}

	render() {
		const { company, status, containerQuery: { xs, md } } = this.props;
		const classNames = cx(s.root, s[`root_${status}`]);
		if (!company) {
			return null;
		}
		const containerCls = cx(
			'flexbox',
			{
				'flexbox--vert flexbox--gap_xs': xs,
				'flexbox--row flexbox--gap_medium flexbox--align-items_center': md,
			}
		);
		return (
			<div className={ classNames }>
				<div className="bg-white padding-bottom-medium padding-top-small padding-vert-mobile-small">
					<GridWrapper>
						<GridRow>
							<GridCol xs={ 4 } hxs={ 8 } >
								<div className={ containerCls }>
									<div className="flexbox__item flexbox__item--min">
										<img
											src={ company.logo }
											alt={ company.name }
											width={ 100 }
										/>
									</div>
									<h1 className="text-size-1 text-weight-bold flexbox__item">
										{ `Покупка полиса в ${company.name}` }
									</h1>
								</div>
							</GridCol>
						</GridRow>
					</GridWrapper>
				</div>
				<div
					className="bg-major-dark-blue padding-top-default"
				>
					{this.purchaseInfo}
				</div>
				<div className={ cx(s.bg, 'bg-major-dark-blue') } />
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const shouldRound = ownProps.status === 'order';
	return {
		assistanceCompanies: assistanceCompaniesSelector(state),
		'package': purchasePackageSelector(state),
		insuranceAmount: purchaseInsuranceAmountSelector(state),
		currency: insuranceAmountCurrencySelector(state),
		franchise: franchiseSumSelector(state),
		options: optionsSelector(state),
		duration: durationSelector(state),
		price: totalSumSelector(state, shouldRound),
	};
}

export default connect(mapStateToProps)(
	applyContainerQuery(PurchaseHeader, {
		md: {
			minWidth: 568
		},
		// По макетам 320
		xs: {
			maxWidth: 567
		}
	})
);
