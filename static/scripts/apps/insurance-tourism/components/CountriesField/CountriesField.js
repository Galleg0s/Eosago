import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { FormField, InputTags } from 'react-ui-2018';
import { createCountriesSelector } from '../../redux/modules/countries';

class CountriesField extends Component {
	static propTypes = {
		label: T.string,
		input: T.shape().isRequired,
		size: T.string,
	};

	static defaultProps = {
		label: null,
		size: 'large',
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

	get placeholder() {
		const { meta: { error }, value } = this.props;
		if (error) {
			return error;
		}
		if (value.length) {
			return '';
		}
		return 'Добавьте страну';
	}

	onChange = newValue =>
		this.props.input.onChange(newValue.map(item => item.id));

	render() {
		const {
			suggestions,
			input,
			label,
			id,
			value,
			size,
		} = this.props;

		return (
			<FormField
				{ ...input }
				id={ id }
				label={ label }
				size={ size }
				multiSection
				suggestions={ suggestions }
				placeholder={ this.placeholder }
				status={ this.status }
				component={ InputTags }
				onChange={ this.onChange }
				value={ value }
			/>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const inputValue = ownProps.input.value || [];
	const countriesSelector = createCountriesSelector(inputValue);
	return {
		value: countriesSelector(state),
	}
}

export default connect(mapStateToProps)(CountriesField);
