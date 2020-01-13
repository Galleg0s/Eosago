import React from 'react';
import T from 'prop-types';
import { FormField } from 'react-ui-2018';
import { getFieldStatus } from '../../utils/utils';

export default function PhoneField({ id, label, size, hint, floatingLabel, input, meta }) {

	return (
		<FormField
			id={ id }
			label={ label }
			size={ size }
			floatingLabel={ floatingLabel }
			status={ getFieldStatus(hint, meta) }
			mask="+7 999 999 99 99"
			inputmode="numeric"
			maskChar={ null }
			{ ...input }
		/>
	);
}

PhoneField.propTypes = {
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
	floatingLabe: T.bool,
	input: T.shape().isRequired,
	meta: T.shape({
		touched: T.bool.isRequired,
		error: T.string,
	}).isRequired,
};

PhoneField.defaultProps = {
	id: null,
	label: null,
	hint: null,
	size: 'large',
	floatingLabel: false,
};
