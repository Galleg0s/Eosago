import React, { Component } from 'react';
import MaskedInput from './MaskedInput.jsx';
import classNames from 'classnames';
import Calendar from 'ui.calendar';
import { addLeadingZero } from 'helpers';
import moment from 'moment';
import { convertTimestampToObj } from '../utils.js';

class InputCalendar extends Component {
	constructor() {
		super();
		this._setDate = this._setDate.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	componentDidMount() {
		const { value, selectedDate, startDate, endDate, disabled } = this.props;

		this._calendarInstance = new Calendar({
			$toggler: !disabled ? this.calendarIcon : null,
			selectedDate,
			startDate,
			endDate,
			onSelect: (date) => {
				this.maskedComponent.maskedInput.value = [
					addLeadingZero(date.day),
					addLeadingZero(date.month),
					date.year
				].join('.');
				this.maskedComponent.maskedInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true}));
			}
		});
		if (value) {
			this._setDate(value);
		}
	}

	componentWillReceiveProps(nextProps) {
		const { value, startDate, selectedDate, endDate, disabled } = nextProps;
		if (this._calendarInstance) {
			if (JSON.stringify(startDate) !== JSON.stringify(this.props.startDate) ||
				JSON.stringify(endDate) !== JSON.stringify(this.props.endDate) ||
				disabled !== this.props.disabled) {

				this._calendarInstance.destroy();
				this._calendarInstance = new Calendar({
					$toggler: !disabled ? this.calendarIcon : null,
					startDate,
					selectedDate,
					endDate,
					onSelect: (date) => {
						this.maskedComponent.maskedInput.value = [
							addLeadingZero(date.day),
							addLeadingZero(date.month),
							date.year
						].join('.');
						this.maskedComponent.maskedInput.dispatchEvent(new Event('input', {
							bubbles: true,
							cancelable: true,
							composed: true
						}));
					}
				});
			}
			if (value) {
				this._setDate(value);
				const inpVal = convertTimestampToObj(value);
				this.maskedComponent.maskedInput.value =
					`${addLeadingZero(inpVal.day)}.${addLeadingZero(inpVal.month)}.${inpVal.year}`;
			} else {
				this.maskedComponent.maskedInput.value = '';
			}
		}
	}

	componentWillUnmount() {
		if (this._calendarInstance) {
			this._calendarInstance.destroy();
			this._calendarInstance = null;
		}
	}

	_setDate(value) {
		if (this._calendarInstance) {
			this._calendarInstance.setDate(convertTimestampToObj(new Date(value).valueOf()));
		}
	}

	_onChange(event) {
		const { name, onChange } = this.props;
		const dateVal = event.target.value.split('.').reverse();
		if (event.target.value && !event.target.value.match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/)) {
			return;
		}
		onChange({
			target: {
				type: 'text',
				name,
				value: new Date(dateVal[0], dateVal[1] - 1, dateVal[2]).valueOf()
			}
		});
	}

	render() {
		const { name, error, value, disabled } = this.props;
		const formattedValue = value ? moment(value).format('DD.MM.YYYY') : '';

		return (
			<div className="input-with-icon input-with-icon--active">
				<MaskedInput
					key="input"
					className={ classNames('input--medium-width', {
						'input--alert': value !== undefined && error
					}) }
					ref={ (input) => { this.maskedComponent = input; } }
					type="text"
					placeholder="дд.мм.гггг"
					name={ name }
					defaultValue={ formattedValue }
					mask="99.99.9999"
					onChange={ this._onChange }
					disabled={ disabled }
				/>
				{ !document.all && !document.documentMode && // IE FIX - не показывать иконку календаря в IE
					<span key="icon" className="input-with-icon__icon icon-font icon-calendar-16 color-gray-blue saturate-on-hover"
						ref={ (span) => { this.calendarIcon = span; } }
					/>
				}
			</div>
		);
	}
}

export default InputCalendar;
