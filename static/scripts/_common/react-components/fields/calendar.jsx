var React = require('react');
var $ = require('jquery');
var UICalendar = require('ui.calendar');
var Helpers = require('helpers');
var DateHelpers = require('../../utils/date-helpers');
var classNames = require('classnames');
import { Icon } from 'react-ui';

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		var inputValue = '';

		if (this.props.value) {
			inputValue = DateHelpers.formatValue(this.props.value);
		}

		this.state = {
			inputValue: inputValue,
			isInputValueValid: true,
			calendarInstance: null
		}
	}
	componentDidMount() {
		this._initCalendar();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.value) {
			this.setState({
				inputValue: DateHelpers.formatValue(nextProps.value),
				isInputValueValid: true
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		var calendarDatesAreEqual = this._isEqualCalendarDates(prevProps.startDate, this.props.startDate) && this._isEqualCalendarDates(prevProps.endDate, this.props.endDate);
		var isSameValue = prevProps.value === this.props.value;

		if (!calendarDatesAreEqual || !isSameValue) {
			this._initCalendar();
		}
	}
	_validateInputValue(value) {
		var regex = /^(0\d{1}|\d{2}).(0\d{1}|\d{2}).(\d{4})$/;
		var isValid = false;
		var match = value.match(regex);
		var date = match ? new Date(match[3], match[2] - 1, match[1]) : null;
		var dateFormatted = date ? Helpers.formatLocalDateToString(date.getFullYear(), date.getMonth() + 1, date.getDate()) : null;
		var isValueInRange = dateFormatted ? DateHelpers.isValueInRange(dateFormatted, this.props.startDate, this.props.endDate) : null;

		if (dateFormatted) {
			isValid = match[0] === DateHelpers.formatValue(dateFormatted) && isValueInRange;
		}

		return isValid;
	}
	_sanitizeInputValue(value) {
		var regex = /[^0-9.]/g;

		return value.replace(regex, '');
	}
	_isEqualCalendarDates(one, two) {
		return !!one && !!two && JSON.stringify(one) === JSON.stringify(two);
	}
	_initCalendar() {
		var _self = this;
		var $calendarContainer = $(_self.refs.calendar);
		var calendarSelectedDate = null;

		if (this.props.value) {
			calendarSelectedDate = DateHelpers.convertStringToDateObject(this.props.value);
		}

		if (this.state.calendarInstance) {
			this.state.calendarInstance.destroy();
		}

		_self.setState({
			calendarInstance: new UICalendar({
				$toggler: $calendarContainer.find('.icon-calendar'),
				startDate: _self.props.startDate,
				selectedDate: calendarSelectedDate ? calendarSelectedDate : _self.props.endDate,
				endDate: _self.props.endDate,
				onSelect: _self._calendarOnSelectHandler
			})
		});
	}
	_onChangeHandler(event) {
		var value = event.target.value;
		var isInputValueValid = this._validateInputValue(value);
		var sanitizedValue = this._sanitizeInputValue(value);
		var newValue = null;
		var valueParsed = null;

		if (isInputValueValid && sanitizedValue === value) {
			valueParsed = value.split('.').reverse().map(function(item) {
				return parseInt(item);
			});
			newValue = Helpers.formatLocalDateToString.apply(Helpers, valueParsed);
		}

		this.setState({
			inputValue: sanitizedValue,
			isInputValueValid: isInputValueValid
		});

		this._updateValue(newValue);
	}
	_onFocusHandler() {
		var _self = this;

		if (!_self.state.calendarInstance.getIsVisible()) {
			$(_self.refs.calendar).find('.icon-calendar').trigger('click');
		}
	}
	_onKeyDownHandler(event) {
		var _self = this;

		if (_self.state.calendarInstance.getIsVisible() && event.which === 9) {
			$(_self.refs.calendar).find('.icon-calendar').trigger('click');
		}
	}
	_calendarOnSelectHandler(date) {
		var _self = this;
		var formattedValue = Helpers.formatLocalDateToString(date.year, date.month, date.day);

		_self.setState({
			inputValue: DateHelpers.formatValue(formattedValue),
			isInputValueValid: true
		});

		_self._updateValue(formattedValue);
	}
	_updateValue(value) {
		this.props.onChange(value);
	}
	render() {
		var inputClassNameList = classNames('form-input-field', {
			'input--alert': !this.state.isInputValueValid
		});

		return (
			<div className="input-with-icon input-with-icon--active" ref="calendar">
				<input
					style={ {width: '170px'} }
					className={ inputClassNameList }
					type="text"
					placeholder="дд.мм.гггг"
					value={ this.state.inputValue }
					onChange={ this._onChangeHandler }
					onFocus={ this._onFocusHandler }
					onKeyDown={ this._onKeyDownHandler }
				/>
				<Icon name="calendar" size="small" className="input-with-icon__icon color-gray-gray" />
			</div>
		);
	}
};
