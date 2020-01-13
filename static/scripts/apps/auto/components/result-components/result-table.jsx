import React from 'react';
import ReactDOM from 'react-dom';
import AppDispatcher from '../../dispatcher/dispatcher.js';
import ResultStore from '../../stores/result-store.js';
import CompanyRowGroup from './product-group.jsx';
import StickyTableHeader from 'ui.table-fixed-header';
import Tooltip from 'ui.tooltip';
import Compare from '../../../../_common/utils/compare-storage.js';
import classNames from 'classnames';
import $ from 'jquery';
import find from 'lodash-es/find';
import map from 'lodash-es/map';
import postMessage from '../../../../_common/utils/post-message.js';
import scrollTo from '../../../../_common/utils/scroll-to.js';
import Hash from '../../../../_common/utils/hash.js';
import { AlertPanel, Button, Icon } from 'react-ui';
import AboutEOSAGOPopup from '../about-eosago-popup.jsx';
import CenterElement from 'center-element';

class ResultTable extends React.Component {
	constructor(props) {
		super(props);
		const ratingTooltip = ResultStore.getRatingTooltipContent();
		const compare = {
			count: Compare.getCount(),
			link: Compare.getLink()
		};
		const groups = ResultStore.getGroups();
		const openedResultPixel = ResultStore.getOpenedResultPixel();

		this._initRatingTooltip = this._initRatingTooltip.bind(this);
		this._updateCompare = this._updateCompare.bind(this);
		this._setActiveCompany = this._setActiveCompany.bind(this);
		this._toggleOptions = this._toggleOptions.bind(this);
		this._isActiveOptions = this._isActiveOptions.bind(this);
		this.state = {
			ratingTooltip: ratingTooltip,
			compare: compare,
			groups: groups,
			activeCompanyId: null,
			activeOptionsIds: [],
			openedResultPixel: openedResultPixel,
			isEOSAGOPopupVisible: false,
			isAllResultsOpened: false,
		}
	}

	componentDidMount() {
		if (!banki.env.isMobileDevice) {
			StickyTableHeader($('[data-sticky-container]'), '[data-sticky-header]');
		}

		this.loader = {
			show: () => {
				const $resultsList = document.querySelectorAll('[data-result-list]')[0];
				if ($resultsList) {
					const spinner = document.createElement('div');
					spinner.className = 'ui-loader-icon-big ui-loading-icon--hor-centered';
					const overlay = document.createElement('div');
					overlay.className = 'ui-loading-overlay-no-icon';
					const loaderText = document.createElement('div');
					loaderText.className = 'ui-loader-text';
					loaderText.innerText = 'Производим пересчет';
					const loaderContainer = document.createElement('div');
					loaderContainer.appendChild(spinner);
					loaderContainer.appendChild(loaderText);
					loaderContainer.className = 'ui-loader-container-with-text';

					$resultsList.appendChild(loaderContainer);
					$resultsList.appendChild(overlay);
					$resultsList.style.position = 'relative';

					this.loader.inst = new CenterElement({
						container: $resultsList,
						element: $resultsList.getElementsByClassName('ui-loader-container-with-text')[0],
						padding: 170
					});
				}
			},

			hide: () => {
				const $resultsList = document.querySelectorAll('[data-result-list]')[0];
				if ($resultsList) {
					const loaderContainer = $resultsList.getElementsByClassName('ui-loader-container-with-text')[0];
					loaderContainer && loaderContainer.parentNode.removeChild(loaderContainer);
					const overlay = $resultsList.getElementsByClassName('ui-loading-overlay-no-icon')[0];
					overlay && overlay.parentNode.removeChild(overlay);
					$resultsList.style.position = 'static';
					$resultsList.style['margin-top'] = null;
					this.loader.inst && this.loader.inst.off();
				}
			}
		};

		this._initRatingTooltip();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.loading !== this.props.loading) {
			if (newProps.loading === true) {
				this.loader.show();
			} else {
				this.loader.hide();
			}
		}
	}

	_initRatingTooltip() {
		const ratingTooltip = ReactDOM.findDOMNode(this).querySelector('[data-rating-tooltip]');

		new Tooltip($(ratingTooltip), {
			placement: 'right',
			width: '300px',
			content: this.state.ratingTooltip
		});
	}

	_accidentFreeApply() {
		const $element = $('#react-auto-drivers');

		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'accident_free',
			data: true
		});

		if ($element.length) {
			setTimeout(function() {
				if (ResultStore.getWidgetId() !== null) {
					postMessage({
						type: 'scroll',
						param: 'elementOffsetTop',
						value: $element.offset().top
					});
				} else {
					scrollTo($element.offset().top);
				}
			}, 100);
		}
	}

	_updateCompare() {
		this.setState({
			compare: {
				count: Compare.getCount(),
				link: Compare.getLink()
			}
		});
	}

	_resetCompare = () => {
		Compare.reset();
		this._updateCompare();

		AppDispatcher.dispatch({
			action: 'COMPARE_RESET'
		});
	};

	_setActiveCompany(companyId, activeOptionId) {
		if (companyId !== this.state.activeCompanyId) {
			this.setState({
				activeCompanyId: companyId,
				activeOptionsIds: activeOptionId ? [activeOptionId] : []
			});
		}
	}

	_toggleOptions(companyId, productId) {
		if (companyId !== this.state.activeCompanyId) {
			this._setActiveCompany(companyId, productId);
		} else {
			const current = { ...this.state.activeOptionsIds };
			const index = this.state.activeOptionsIds.indexOf(productId);

			if (index !== -1) {
				current.splice(index, 1);

				this.setState({
					activeOptionsIds: current
				});
			} else {
				current.push(productId);

				this.setState({
					activeOptionsIds: current
				});
			}
		}
	}

	_isActiveOptions(companyId, productId) {
		if (companyId !== this.state.activeCompanyId) {
			return false;
		} else {
			return this.state.activeOptionsIds.indexOf(productId) !== -1;
		}
	}

	showEOSAGOPopup = () => this.setState({isEOSAGOPopupVisible: true});

	closeEOSAGOPopup = () => this.setState({isEOSAGOPopupVisible: false});

	unlockResults = () => ResultStore.clearConfirmedResults();

	_renderGroup = (resultGroup, key) => {
		const confirmedResults = this.props.confirmedResults;

		const groups = resultGroup.map((result) => {
			const confirmedResult = confirmedResults && confirmedResults.filter((i) => {
				return i.company.id === result.company.id;
			});
			return (
				<CompanyRowGroup
					key={ key + '-' + result.company.id }
					group={ key + '-' + result.company.id }
					types={ this.props.data.insurance_types }
					result={ result }
					confirmedResult={ confirmedResult }
					updateCompare={ this._updateCompare }
					toggleOptions={ this._toggleOptions.bind(this, result.company.id) }
					isActiveOptions={ this._isActiveOptions.bind(this, result.company.id) }
					resultType={ key }
				/>
			)
		});

		if (key === 5) {
			if (confirmedResults !== null && confirmedResults.length !== resultGroup.length) {
				groups.unshift(
					<AlertPanel
						theme="warning"
					>
						Неактивные предложения на данный момент недоступны.
						<a className="pseudo-link"
							href="javascript:void(0)"
							onClick={ this.unlockResults }
							data-test="auto-rules"
						>
							{ ' Попробовать еще раз. ' }
						</a>
					</AlertPanel>
				);
			}
		}

		groups.unshift((
			<div className="table-flex__row-group group-title" key={ key }>
				<div className="flexbox flexbox--justify-content_space-between">
					<div>{ this.state.groups.titles[key] }</div>
					{key === 5 &&
						<div
							className="color-light-mustard pseudo-link font-normal"
							onClick={ this.showEOSAGOPopup }
							data-test="auto-rules"
						>
							Узнать преимущества
						</div>
					}
				</div>
			</div>
		));

		return groups;
	};

	// _showAllResults = () => this.setState({ isAllResultsOpened: true });

	render() {

		const accidentFreeApply = this.props.data.insurance_types &&
								this.props.data.insurance_types.osago &&
								!this.props.data.first_osago &&
								!this.props.data.accident_free &&
								(!this.props.data.insurance_types.kasko || !find(this.props.data.car, {id: null})) ?

								(
									<div className="accident-free-apply">
										<Icon name="attention" size="small" />
										<span>
											Расчет стоимости произведен без учета скидки за безаварийную езду. Для расчета со скидкой заполните&nbsp;
											<span className="pseudo-link" onClick={ this._accidentFreeApply }>дополнительные поля</span>.
										</span>
									</div>
								) : null;

		const kbmAlertMessage = this.props.kbmStatus === 0 ? (
			<div className="margin-top-default margin-bottom-default">
				<AlertPanel
					theme="warning"
				>
					Расчет выполнен без учета скидки за безаварийную езду (КБМ) из-за недоступности сервиса РСА. Скидка будет учтена при расчете электронного полиса ОСАГО, после заполнения анкеты и до момента оплаты.
				</AlertPanel>
			</div>
		) : null;

		const allResults = this.props.result;
		const eResults = allResults[5] ? this._renderGroup(allResults[5], 5) : null;
		const resultRows = map(allResults, (resultGroup, key) => {
			if (key != 5) {
				return this._renderGroup(resultGroup, key);
			}
		});
		if (eResults) {
			resultRows.unshift(eResults);
		}

		const openedResultPixelItem = this.state.openedResultPixel ? (<img src={ this.state.openedResultPixel } width="1" height="1" style={ {display: 'none'} } />) : null;
		const leadGidPixelItem = this.state.openedResultPixel ? (
			<img src={ `https://go.leadgid.ru/aff_l?offer_id=${ (this.props.data.insurance_types && this.props.data.insurance_types.kasko) ? 3029 : 3027 }&adv_sub=${Hash.get().split(':')[0]}` } width="1" height="1" style={ {display: 'none'} } />
		) : null;

		// const showAllBtn = (
		// 	<div className="text-align-center margin-top-default">
		// 		<Button
		// 			bordered={ true }
		// 			clickHandler={ this._showAllResults }
		// 		>
		// 			Показать еще
		// 		</Button>
		// 	</div>
		// );

		return (
			<div>
				<div className="position-relative margin-bottom-default margin-top-anti">

					{ accidentFreeApply }
					{ kbmAlertMessage }

					{ this.state.compare.count ?
						<div className="compare-btn hidden--md-down">
							<a href={ this.state.compare.link } target="_blank" className="button button--size_small button--bordered-blue">сравнить: { this.state.compare.count }</a>
							<span className="button button--size_small button--bordered" onClick={ this._resetCompare }>очистить</span>
						</div> : null
					}
				</div>
				<div
					className={ classNames({
						'product-table--kasko': this.props.data.insurance_types && this.props.data.insurance_types.kasko,
						'product-table--osago': this.props.data.insurance_types && this.props.data.insurance_types.osago,
					}) }
					data-sticky-container
					data-result-list
				>
					{ openedResultPixelItem }
					{ leadGidPixelItem }
					{/* Класс "table-flex__row--header" добавлен для корректной работы модуля "table-fixed-header" */}
					<div className="table-flex__row--header hidden--md-down" data-sticky-header>
						<div className="bg-gray padding-default">
							<div className="grid__row grid__row--v-zero">
								<div className="grid__cell grid__cell--min">
									<div className="insurance-company-logo padding-left-default" />
								</div>
								<div className="grid__cell">
									<div className="grid__row font-size-medium grid__row--align-center">
										<div className="grid__cell">
											Название, компания
										</div>

										{ this.props.data.insurance_types && this.props.data.insurance_types.kasko &&
											<div className="grid__cell padding-left-large">КАСКО</div>
										}

										{ this.props.data.insurance_types && this.props.data.insurance_types.kasko &&
											<div className="grid__cell">
												<div className="is-center">
													Рейтинг продукта&nbsp;
													<span className="icon-font icon-question-16 icon-tooltip" data-rating-tooltip />
												</div>
											</div>
										}

										{ this.props.data.insurance_types && this.props.data.insurance_types.osago &&
											<div className="grid__cell">ОСАГО</div>
										}

										<div className="grid__cell">
											{ this.state.compare.count ?
												<div className="grid__row grid__row--v-xs">
													<div className="grid__cell grid__cell--min">
														<a href={ this.state.compare.link } target="_blank" className="button button--size_small button--bordered-blue">сравнить: { this.state.compare.count }</a>
													</div>
													<div className="grid__cell grid__cell--min">
														<span className="button button--size_small button--bordered" onClick={ this._resetCompare }>очистить</span>
													</div>
												</div> : null
											}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{ resultRows }

					{ /* { this.props.data.insurance_types && !this.props.data.insurance_types.kasko ?*/ }
						{/* this.state.isAllResultsOpened ? resultRows : [eResults, showAllBtn] : resultRows*/ }
					{ /* }*/ }

				</div>
				<AboutEOSAGOPopup isOpen={ this.state.isEOSAGOPopupVisible } closeHandler={ this.closeEOSAGOPopup } />
			</div>
		)
	}
}

module.exports = ResultTable;
