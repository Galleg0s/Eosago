import React, { Component } from 'react';
import T from 'prop-types';
import moment from 'moment';
import { FormField } from 'react-ui-2018';
import { getFieldStatus } from '../../utils/utils';

class InputDateField extends Component {
	static propTypes = {
		id: T.string,
		label: T.string,
		hint: T.string,
		/** Размер */
		size: T.oneOf([
			'xl',
			'large',
			'medium',
			// С плавающим лейблом
			'lightL',
			'lightM',
			'lightS',
			// Не основыные:
			'custom-landings',
			'small',
		]),
		floatingLabel: T.bool,
		input: T.shape().isRequired,
	};

	static defaultProps = {
		size: 'large',
	};

	state = {
		value: this.props.input.value,
	};

	get fieldStatus() {
		const { hint, meta } = this.props;
		return getFieldStatus(hint, meta);
	}

	get value() {
		const { value } = this.state;
		let date = moment(value, 'YYYY-MM-DD', true);

		if (date.isValid()) {
			return date.format('DD.MM.YYYY');
		}

		return value;
	}

	onChange = (e) => {
		const { input } = this.props;
		const value = e.target.value;
		const date = moment(value, 'DD.MM.YYYY', true);
		let dateValue = '';

		this.setState({ value });

		if (date.isValid()) {
			dateValue = date.format('YYYY-MM-DD');
		}

		if (input.value !== dateValue) {
			input.onChange(dateValue);
		}
	};

	render() {
		const { id, label, size, floatingLabel } = this.props;
		return (
			<FormField
				id={ id }
				label={ label }
				size={ size }
				floatingLabel={ floatingLabel }
				status={ this.fieldStatus }
				mask="99.99.9999"
				inputmode="numeric"
				maskChar="_"
				value={ this.value }
				onChange={ this.onChange }
			/>
		);
	}
}

export default InputDateField;

