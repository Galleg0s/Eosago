var React = require('react');
var Component = React.Component;
var AppDispatcher = require('../dispatcher/dispatcher.js');
var PopupStore = require('../stores/popup-store.js');
var DataStore = require('../stores/data-store.js');
var ResultStore = require('../stores/result-store.js');
var CircleStat = require('ui.circle-stat');
import { Icon } from 'react-ui';

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			popup: PopupStore.getPopup('progressWidgetPopup'),
			progress: 0,
			tipList: [],
			visibleTipIndex: 0,
			tipsIntervalId: null
		};
		this._update = this._update.bind(this)
		this._updateTips = this._updateTips.bind(this)
		this._cancelCalculation = this._cancelCalculation.bind(this)
		this._closePopup = this._closePopup.bind(this)
		this._componentWillMount()
	}

	_componentWillMount() {
		DataStore.addReceiveDataListener(this._updateTips);
		ResultStore.addUpdateListener(this._update);
	}

	componentDidMount() {
		this._initCircleStat(0, this.state.progress);
		this._initTipsInterval();
	}

	componentDidUpdate(prevProps, prevState) {
		var _self = this;
		var results = ResultStore.getResult();
		var isCalculationCompleted = _self.state.progress === 100;
		var hasResults = results.result && Object.keys(results.result).length;
		var hasError = results.error;
		var isResultLocked = results.locked;
		var timeoutDelay = 0;

		const kasko = results.data && results.data.insurance_types && results.data.insurance_types.kasko;

		if (_self.state.progress !== prevState.progress) {
			_self._initCircleStat(prevState.progress, _self.state.progress);
		}

		if (isCalculationCompleted || hasResults || hasError || (kasko && isResultLocked)) {
			if (!hasError) {
				timeoutDelay = isCalculationCompleted || (kasko && isResultLocked) ? 1000 : 5000;
			}

			setTimeout(() => {
				_self._closePopup();
			}, timeoutDelay);
		}
	}

	componentWillUnmount() {
		var tipsIntervalId = this.state.tipsIntervalId;

		if (tipsIntervalId) {
			clearInterval(tipsIntervalId);
			this.setState({
				tipsIntervalId: null
			});
		}

		DataStore.removeReceiveDataListener(this._updateTips);
		ResultStore.removeUpdateListener(this._update);
	}

	_update() {
		var results = ResultStore.getResult();

		this.setState({
			progress: results.progress
		});
	}

	_updateTips() {
		this.setState({
			tipList: DataStore.getTips()
		});
	}

	_initCircleStat(progressFrom, progressTo) {
		var progressElement = this.refs.progress;
		var progress = Math.round(progressTo);

		if (progress < progressFrom) {
			progressFrom = progress;
		}

		var options = {
			size: 100,
			valueFrom: progressFrom === 100 ? 0 : progressFrom,
			value: progress,
			label: progress + '%',
			font: 'normal 30px \'PT Sans\'',
			animate: true
		};

		if (progressElement) {
			new CircleStat(progressElement, options);
		}
	}

	_initTipsInterval() {
		var _self = this;
		var tipsIntervalId = _self.state.tipsIntervalId;

		if (tipsIntervalId) {
			return;
		}

		tipsIntervalId = setInterval(function() {
			var visibleTipIndex = _self.state.visibleTipIndex;

			if (!_self.state.popup.isOpen) {
				return;
			}

			if (_self.state.tipList.length && visibleTipIndex < _self.state.tipList.length - 1) {
				visibleTipIndex++;
			} else {
				visibleTipIndex = 0;
			}

			_self.setState({
				visibleTipIndex: visibleTipIndex
			});
		}, 5000);

		_self.setState({
			tipsIntervalId: tipsIntervalId
		});
	}

	_closePopup() {
		if (this.state.popup.isOpen) {
			this.state.popup.hidePopup.apply(this.state.popup);
		}
	}

	_cancelCalculation() {
		AppDispatcher.dispatch({
			action: 'CANCEL'
		});
		this._closePopup();
	}

	render() {
		var _self = this;
		var tipList = _self.state.tipList.map(function(tipItem, index) {
			var classes = 'tip-item' + (index === _self.state.visibleTipIndex ? ' active' : '');

			return (
				<div className={ classes } key={ tipItem.id }>
					<img
						className="tip-item__image"
						src={ tipItem.tab_pic_url }
						width="100"
						height="100"
						alt={ tipItem.title }
					/>
					<div className="tip-item__title font-size-medium">{ tipItem.title }</div>
				</div>
			);
		});

		return (
			<div>
				<Icon
					name="close"
					size="small"
					clickHandler={ _self._cancelCalculation }
					className="ui-popup__close-icon icon-hover"
				/>
				<div className="ui-panel-white padding-default">
					<div className="font-size-large border-bottom-solid-light margin-bottom-default padding-bottom-medium">
						<div className="header-h2 is-center">Подождите пару секунд, мы подбираем для вас лучшие предложения.</div>
					</div>
					<div className="is-center">
						<canvas ref="progress" width="100" height="100"></canvas>
					</div>
					<div className="header-h3 is-center margin-top-default margin-bottom-small">Заказывайте полис у нас: это выгодно!</div>
					{ _self.state.tipList.length ?
						<div className="tip-list center-block">
							{ tipList }
						</div> : null
					}
				</div>
			</div>
		);
	}
};

