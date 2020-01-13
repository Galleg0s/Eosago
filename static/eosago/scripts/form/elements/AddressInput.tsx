import React from 'react';
import {WrappedFieldProps} from 'redux-form';
import {FormField} from 'react-ui-2018';
import InputDropdownSelectAddress from '@BUNDLES/MainBundle/Resources/static/input-dropdown-select-address/input-dropdown-select-address.jsx';
import {getValidationStatus} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';

export interface AddressInputProps {
	label: string
}

const AddressInput = ({label, input: {value, onChange, onBlur}, meta}: WrappedFieldProps & AddressInputProps) => {
	return (
		<FormField
			label={ label }
			size="medium"
			component={ InputDropdownSelectAddress }
			value={ value }
			onChange={ onChange }
			onBlur={ onBlur }
			status={ getValidationStatus(meta) }
		/>
	)
};

export default AddressInput;
