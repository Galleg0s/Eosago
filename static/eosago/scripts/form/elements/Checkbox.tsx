import React from 'react';
import {WrappedFieldProps} from 'redux-form';
import {Checkbox} from 'react-ui-2018';

interface CheckboxFormFieldProps {
	title: Element
}

const CheckboxFormField = ({ title, input: { value, onChange }, meta: {dirty, valid}}: WrappedFieldProps & CheckboxFormFieldProps) => {
	return (
		<Checkbox
			title={ title }
			checked={ value }
			changeHandler={ onChange }
			isError={ dirty && !valid }
		/>
	)
};

export default CheckboxFormField;
