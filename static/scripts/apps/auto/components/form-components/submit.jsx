import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';

import React from 'react';
import $ from 'jquery';
import AppDispatcher from '../../dispatcher/dispatcher.js';
import UserStore from '../../stores/user-store.js';
import ValidationStore from '../../stores/validation-store.js';
import ResultStore from '../../stores/result-store.js';
import PopupStore from '../../stores/popup-store.js';
import classNames from 'classnames';
import postMessage from '../../../../_common/utils/post-message.js';
import scrollTo from '../../../../_common/utils/scroll-to.js';

class AutoFormSubmit extends React.Component {
	constructor(props) {
		super(props);
		this._showPopup = this._showPopup.bind(this);
		this._showProgressPopup = this._showProgressPopup.bind(this);
		this._toggleAcception = this._toggleAcception.bind(this);
		this._scrollTo = this._scrollTo.bind(this);
		this._scrollToField = this._scrollToField.bind(this);
		this._submitForm = this._submitForm.bind(this);
		this.state = {
			popup: PopupStore.getPopup('agreementPopup'),
			progressPopup: PopupStore.getPopup('progressWidgetPopup'),
			hints: ValidationStore.getHints(),
			valid: ValidationStore.validateForm(this.props.data)
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			hints: ValidationStore.getHints(),
			valid: ValidationStore.validateForm(nextProps.data)
		});
	}

	_showPopup(event) {
		event.preventDefault();
		this.state.popup.showPopup.apply(this.state.popup);
	}

	_showProgressPopup() {
		this.state.progressPopup.showPopup.apply(this.state.progressPopup);
	}

	_toggleAcception() {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'accept_rules',
			data: !this.props.data.accept_rules
		});
	}

	_scrollTo(selector, callback) {
		var $element = $(selector);
		var position = $element.offset().top - 100;

		function afterScrollCallback() {
			if (callback && typeof(callback) === 'function') {
				callback($element);
			}
		}

		if ($element.length) {
			if (ResultStore.getWidgetId() !== null) {
				postMessage({
					type: 'scroll',
					param: 'elementOffsetTop',
					value: position
				});

				afterScrollCallback();
			} else {
				scrollTo(position, afterScrollCallback);
			}
		}
	}

	_scrollToField(selector) {
		var _self = this;
		var callback = function($element) {
			var $collection = $element.hasClass('form-input-field') ? $element : $element.find('.form-input-field');

			if ($collection.length) {
				$collection.addClass('focused');
				setTimeout(function() {
					$collection.removeClass('focused');
				}, 2000);
			}
		};

		return function() {
			_self._scrollTo(selector, callback);
		};
	}

	_submitForm() {
		if (!this.state.valid || this.props.data.loading) {
			return;
		}

		UserStore.setCookies(['region', 'region_registration']);

		AppDispatcher.dispatch({
			action: 'SUBMIT'
		});

		dataLayer.push({ event: 'GTM_event',
			eventCategory: 'INS_Calculator',
			eventAction: 'INS_Calculator__user-form_submit',
			eventLabel: undefined,
			eventValue: undefined
		});

		this._showProgressPopup();

		eventEmitter.emit('insurance:e-osago-reset-form');
	}

	render() {
		var _self = this;
		var btnClasses = classNames('button', 'button--theme_blue', {'button--disabled': !this.state.valid});
		var hintsContent = this.state.hints.map(function(hint, index) {
			return (
				<div className="grid__cell grid__cell--min">
					<span
						className="pseudo-link"
						onClick={ _self._scrollToField("[data-hint='" + hint.fieldName + "']") }
						data-field-name={ hint.fieldName }
						key={ index }
					>
						{ hint.title }
					</span>
				</div>
			);
		});

		return (
			<div className="bg-dark-gray padding-default">
				<div className="grid__row grid__row--v-zero" data-hint="accept_rules">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold"></div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<div className="grid__row">
							<div className="grid__cell">
								<label className="title-checkbox">
									<input type="checkbox" className="modern-checkbox"
										checked={ this.props.data.accept_rules }
										onChange={ this._toggleAcception }
										data-test="auto-accept-rules"
									/>
									<span className="checkbox-label">
										Подтверждаю свое согласие с&nbsp;
										<span
											className="pseudo-link"
											onClick={ this._showPopup }
											data-test="auto-rules"
										>
											условиями
										</span>
										&nbsp;передачи данных
									</span>
								</label>
							</div>
						</div>
						{ !this.props.data.loading &&
							<div className="grid__row">
								<div className="grid__cell">
									<label className="title-checkbox">
										<input
											type="checkbox"
											className="modern-checkbox"
											checked={ this.props.saveEnabled }
											onChange={ this.props.onSaveEnableClick }
											data-test="auto-save-calculate-result"
										/>
										<span className="checkbox-label">Сохранить расчет</span>
									</label>
								</div>
							</div>
						}
						{ this.props.data.loading ?
							<div className="grid__row padding-top-default">
								<div className="grid__cell">
									<div className="loading-message">
										Подождите, идет расчет
										<span className="loading-message__dot" data-count="1">.</span>
										<span className="loading-message__dot" data-count="2">.</span>
										<span className="loading-message__dot" data-count="3">.</span>
									</div>
								</div>
							</div> :
							<div className="grid__row padding-top-default">
								<div className="grid__cell">
									<div className="submit-btn">
										<button
											type="submit"
											className={ btnClasses }
											onClick={ this._submitForm }
											data-test="auto-submit"
											disabled={ !this.state.valid }
										>рассчитать</button>
									</div>
								</div>
							</div>
						}
						{ this.state.hints.length > 0 && !this.props.data.loading &&
							<div className="grid__row padding-top-default">
								<div className="grid__cell">
									<div className="font-size-default">
										<p className="color-gray-gray padding-bottom-x-small font-size-medium color-red">Необходимо заполнить следующие поля:</p>
										<div className="grid__row grid__row--v-xs">
											{ hintsContent }
										</div>
									</div>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		)
	}
}

module.exports = AutoFormSubmit;
