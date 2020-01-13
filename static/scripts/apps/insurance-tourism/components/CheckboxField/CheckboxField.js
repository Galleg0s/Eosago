import React from 'react';
import T from 'prop-types';
import { Checkbox } from 'react-ui-2018';

export default function CheckboxField({ title, input: { onChange, value } }) {
	return (
		<Checkbox
			title={ title }
			checked={ value }
			changeHandler={ onChange }
		/>
	);
}

CheckboxField.propTypes = {
	title: T.string,
	input: T.shape({
		onChange: T.func.isRequired,
		value: T.bool.isRequired,
	}).isRequired,
};

CheckboxField.defaultProps = {
	title: null,
};
