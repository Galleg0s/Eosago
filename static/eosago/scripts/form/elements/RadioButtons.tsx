import React from 'react';
import {RadioButton, RadioGroup} from 'react-ui-2018';
import {WrappedFieldProps} from 'redux-form';
import {IdentifierType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

interface RadioButtonItem {
	value: IdentifierType,
	title: string
}

interface RadioButtonsProps {
	data: Array<RadioButtonItem>
}

const RadioButtons = ({ data, input: { value, onChange } }: WrappedFieldProps & RadioButtonsProps) => {
	return (
		<RadioGroup
			inline
			isFullWidth
			size="large"
			theme="transparent-light"
			onChange={ (obj: RadioButtonItem) => onChange(obj.value) }
			value={ value }
		>
			{data.map(item => {
				return (
					<RadioButton key={ item.title } value={ item.value }>
						{ item.title }
					</RadioButton>
				)
			})}
		</RadioGroup>
	)
};

export default RadioButtons;
