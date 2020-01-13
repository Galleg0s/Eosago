import React, { Component } from 'react';
import T from 'prop-types';
import moment from 'moment';
import { Checkbox, FormField, InputCalendar, Tooltip, Icon } from 'react-ui-2018';

class DatePickerField extends Component {
	static propTypes = {
		type: T.oneOf(['single', 'range']),
		dateFormat: T.string,
	};

	static defaultProps = {
		type: 'single',
		dateFormat: 'YYYY-MM-DD',
	};

	get status() {
		const { meta: { touched, error } } = this.props;
		if (touched && error) {
			return {
				type: 'error',
			};
		}
		return { type: 'default' };
	}

	get value() {
		const { type, input, dateFormat } = this.props;
		const { startDate, endDate } = input.value;
		if (!input.value) {
			return null;
		}
		if (type === 'range') {
			return {
				startDate: startDate && moment(startDate, dateFormat),
				endDate: endDate && moment(endDate, dateFormat),
			}
		}
		return startDate && moment(startDate, dateFormat);
	}

	onChange = value => {
		const { type, input, dateFormat } = this.props;
		let startDate;
		let endDate;
		if (type === 'range') {
			startDate = value.startDate && value.startDate.format(dateFormat);
			endDate = value.endDate && value.endDate.format(dateFormat);
		} else if (type === 'single') {
			startDate = value && value.format(dateFormat);
		}
		input.onChange({ startDate, endDate });
	};

	render() {
		const {
			input,
			meta: { error },
			dateFormat,
			...otherProps
		} = this.props;
		return (
			<FormField
				component={ InputCalendar }
				status={ this.status }
				value={ this.value }
				onChange={ this.onChange }
				{ ...otherProps }
			/>
		);
	}
}

export default DatePickerField;
