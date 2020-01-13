var React = require('react');
var ReactDOM = require('react-dom');
var UserStore = require('../stores/user-store');
var ResultStore = require('../stores/result-store');
var ResultTable = require('./result-components/result-table.jsx');
var OfferCount = require('./result-components/offer-count.jsx');
var PopupStore = require('../stores/popup-store');
var PhoneWidget = require('./phone-widget.jsx');
var $ = require('jquery');
var postMessage = require('../../../_common/utils/post-message');
var scrollTo = require('../../../_common/utils/scroll-to');
import { AlertPanel } from 'react-ui';

class Result extends React.Component {
	constructor(props) {
		super(props)
		var data = UserStore.getData();
		var results = ResultStore.getResult();
		this.state = {
			result: results.result,
			confirmedResults: results.confirmedResults,
			error: results.error,
			kbmStatus: results.kbmStatus,
			locked: results.locked,
			data: results.data,
			loading: data.loading,
			needScroll: this._getOffersCount(results) > 0,
			resultsCount: (results.count) ? results.count.offers : 0,
			visibleResultsCount: this._getOffersCount(results)
		};
		this._update = this._update.bind(this)
		this._scrollToForm = this._scrollToForm.bind(this)
		this._componentWillMount()
	}

	_componentWillMount() {
		ResultStore.addUpdateListener(this._update);
		UserStore.addChangeListener(this._update);
		PopupStore.getPopup('progressWidgetPopup').options.onAfterClose = () => this._scrollTo($(ReactDOM.findDOMNode(this)));
	}

	componentDidUpdate() {
		if (this.state.needScroll || this.state.error) {
			this._scrollTo($(ReactDOM.findDOMNode(this)))
		}
	}

	componentWillUnmount() {
		$('html, body').stop(true, true);
		ResultStore.removeUpdateListener(this._update);
	}

	_update() {
		const data = UserStore.getData();
		const results = ResultStore.getResult();

		this.setState({
			result: results.result,
			confirmedResults: results.confirmedResults,
			error: results.error,
			kbmStatus: results.kbmStatus,
			locked: results.locked,
			data: results.data,
			loading: data.loading,
			needScroll: this.state.locked && !results.locked,
			resultsCount: (results.count) ? results.count.offers : 0,
			visibleResultsCount: this._getOffersCount(results)
		});
	}

	_scrollTo($element) {
		setTimeout(function() {
			if ($element && $element.offset() && $element.offset().top > 100) {
				if (ResultStore.getWidgetId() !== null) {
					postMessage({
						type: 'scroll',
						param: 'elementOffsetTop',
						value: $element.offset().top - 100
					});
				} else {
					scrollTo($element.offset().top - 100);
				}
			}
		}, 100);
	}

	_scrollToForm() {
		var $element = $('#react-auto-form');

		this._scrollTo($element);
	}

	_getOffersCount(result) {
		var offersCount = 0;

		Object.keys(result.result).forEach((key) => {
			result.result[key].forEach((company) => {
				offersCount += company.products.kasko.length;

				if (company.products.osago !== null) {
					offersCount++;
				}
			})
		});

		return offersCount;
	}

	get notFoundMessage() {
		const { data: { period } } = this.state;
		return `По вашему запросу ничего не найдено.${period !== 8 ? ' Попробуйте увеличить срок страхования до 12 месяцев.' : ''}`;
	}

	render() {
		const { resultsCount, visibleResultsCount, error, locked, data, result, confirmedResults, kbmStatus, loading } = this.state;
		const special = ResultStore.getSpecial();

		if (visibleResultsCount === 0 && !error && !locked) {
			return null;
		} else {
			return (
				<div className="margin-top-default">
					{ error ? (
						<div className="margin-top-default margin-bottom-default">
							<AlertPanel
								theme="warning"
							>
								{ special && special.company_name ?
									<span>{ 'К сожалению по данному автомобилю невозможно приобрести страховой полис в ' + special.company_name + '.' }</span> :
									<span>{this.notFoundMessage} <a className="pseudo-link" href="javascript:void(0);" onClick={ this._scrollToForm }>Изменить параметры поиска</a>.</span>
								}
							</AlertPanel>
						</div>
					) : (
						<div>
							<OfferCount />
							{ visibleResultsCount > 0 &&
								<ResultTable
									data={ data }
									result={ result }
									confirmedResults={ confirmedResults }
									kbmStatus={ kbmStatus }
									loading={ loading }
									locked={ locked }
								/>
							}
							{ (data.insurance_types && data.insurance_types.kasko || !!resultsCount) && locked &&
								<PhoneWidget resultsCount={ resultsCount } visibleResultsCount={ visibleResultsCount } />
							}
						</div>
					)}
				</div>
			);
		}
	}
}

module.exports = Result;
