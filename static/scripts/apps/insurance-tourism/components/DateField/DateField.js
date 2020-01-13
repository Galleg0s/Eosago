import React, { Component } from 'react';
import T from 'prop-types';
import moment from 'moment';
import { addLeadingZero } from 'helpers';
import { FormField, InputCalendar } from 'react-ui-2018';

export default function DateField({ id, label, editable, size, hint, startDate, endDate, minDate, maxDate, floatingLabel, input, meta }) {
	const { value, onChange, ...otherInputProps } = input;
	const getFieldStatus = () => {
		const { touched, error } = meta;
		if (touched && error) {
			return {
				type: 'error',
				message: error,
			}
		}
		return {
			type: 'default',
			message: hint,
		};
	};

	let today = new Date();
	today = `${today.getFullYear()}-${addLeadingZero(today.getMonth() + 1)}-${today.getDate()}`;

	const getValue = () => {
		const input = arguments[0] && arguments[0].input || this.props.input;
		let newValue;
		let today = new Date();
		today = `${today.getFullYear()}-${addLeadingZero(today.getMonth() + 1)}-${today.getDate()}`;

		if (value && value.hasOwnProperty('startDate')) {
			newValue = value.startDate || today;
			today === newValue && input.onChange({startDate: newValue, endDate: newValue});
		} else {
			newValue = value;
		}

		if (typeof newValue === 'string' && newValue.split('.').length === 3 && value.length > 9) {
			newValue = newValue.split('.').reverse().join('-');
			input.onChange(newValue);
		} else if (value.length < 10) {
			return value;
		}

		const date = moment(newValue, 'YYYY-MM-DD');

		if (date.isValid()) {
			return date.format('L');
		} else if (value.split('.').length === 3) {
			return value;
		} else {
			return value.split('-').reverse().join('.');
		}

		return newValue;
	};

	const handleChange = value => {
		const dateString = value.format('YYYY-MM-DD');
		input.onChange({ startDate: dateString });
	};

	return (
		<FormField
			id={ id }
			label={ label }
			size={ size }
			startDate={ startDate }
			endDate={ endDate }
			minDate={ minDate }
			maxDate={ maxDate }
			status={ getFieldStatus() }
			value={ input.value.startDate && moment(input.value.startDate, 'YYYY-MM-DD') }
			editable={ editable }
			component={ InputCalendar }
			floatingLabel={ floatingLabel }
			onChange={ handleChange }
			{ ...otherInputProps }
		/>
	);
}

DateField.propTypes = {
	id: T.string,
	label: T.string,
	hint: T.string,
	size: T.oneOf(['small', 'medium', 'large']),
	floatingLabe: T.bool,
	input: T.shape().isRequired,
	meta: T.shape({
		touched: T.bool.isRequired,
		error: T.string,
	}).isRequired,
};

DateField.defaultProps = {
	id: null,
	label: null,
	hint: null,
	size: 'medium',
	floatingLabel: false,
};

