import React, { Component } from 'react';
import T from 'prop-types';
import moment from 'moment';
import { FormField, InputCalendar } from 'react-ui-2018';

class InputRangeCalendar extends Component {

	static propTypes = {
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

	static defaultProps = {
		id: null,
		label: null,
		hint: null,
		size: 'medium',
		floatingLabel: false,
	};

	// componentDidMount() {
	// 	this.props.input.value && this.props.input.onChange(undefined);
	// }

	handleChange = ({ startDate, endDate }) => {
		this.props.input.onChange({
			startDate: startDate && startDate.format('YYYY-MM-DD'),
			endDate: endDate && endDate.format('YYYY-MM-DD'),
		});
	};

	get value() {
		const { input } = this.props;
		if (!input.value) {
			return {};
		}
		const { startDate, endDate } = input.value;
		return {
			startDate: startDate && moment(startDate, 'YYYY-MM-DD', true),
			endDate: endDate && moment(endDate, 'YYYY-MM-DD', true),
		};
	}

	render() {
		const { id, label, size, type, hint, startDate, endDate, minDate, floatingLabel, input, meta } = this.props;
		const { name, value, onChange, ...otherInputProps } = input;
		const getFieldStatus = () => {
			const { touched, error } = meta;
			if (touched && error) {
				return {
					type: 'error',
					message: null,
				}
			}
			return {
				type: 'default',
				message: hint,
			};
		};

		const getValue = () => {
			const input = arguments[0] && arguments[0].input || this.props.input;
			let startDate;
			let endDate;
			if (value.length > 10) {
				startDate = value.slice(0, 10);
				endDate = value.slice(-10);
			} else {
				startDate = value.startDate;
				endDate = value.endDate;
			}
			const { error } = meta;
			const startDateCalendar = moment(startDate, 'YYYY-MM-DD');
			const endDateCalendar = moment(endDate, 'YYYY-MM-DD');
			if (error) {
				const emptyValue = '';
				input && input.onChange({ startDate: undefined, endDate: undefined });
				return emptyValue;
			}
			if (startDateCalendar.isValid() && endDateCalendar.isValid()) {
				return `${startDateCalendar.format('L')} — ${endDateCalendar.format('L')}`;
			}
			return value;
		};

		const handleChange = value => {
			const dates = {
				startDate: moment(value[0]).format('YYYY-MM-DD'),
				endDate: moment(value[1]).format('YYYY-MM-DD')
			};
			onChange(dates);
		};

		return (
			<FormField
				id={ id }
				label={ label }
				size={ size }
				type={ type }
				name={ name }
				startDate={ startDate }
				endDate={ endDate }
				minDate={ minDate }
				status={ getFieldStatus() }
				value={ this.value }
				placeholder="Выберите дату"
				component={ InputCalendar }
				floatingLabel={ floatingLabel }
				onChange={ this.handleChange }
				className="margin-bottom-x-small"
				{ ...otherInputProps }
			/>
		);
	}
}

export default InputRangeCalendar;
