import React, {SyntheticEvent} from 'react';
import {WrappedFieldProps} from 'redux-form';
import {FormField} from 'react-ui-2018';
import {getValidationStatus} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';

export enum InputType {
	text = 'text',
	number = 'number',
	tel = 'tel',
}

const getRawValue = (value: string) => {
	return value.replace(/\s/g, '');
}

interface InputProps {
	label: string,
	disabled?: boolean,
	type: InputType,
	placeholder?: string,
	pattern?: string,
	mask?: string,
	additionalFormatChars?: Object,
	status?: {
		message: string,
	},
	autoFocus?: boolean,
	useRawInputValue?: boolean
}

const Input =
	({autoFocus,
		label,
		disabled,
		status,
		type,
		placeholder,
		pattern,
		mask,
		additionalFormatChars,
		input,
		meta,
		useRawInputValue
	}: WrappedFieldProps & InputProps) => {

		return (
			<FormField
				label={ label }
				type={ type }
				name={ name }
				mask={ mask }
				additionalFormatChars={ additionalFormatChars }
				placeholder={ placeholder }
				pattern={ pattern }
				size="medium"
				status={ status || getValidationStatus(meta) }
				{ ...input }
				onChange={ !useRawInputValue ? input.onChange : (e: React.ChangeEvent<HTMLInputElement>) => {
					return input.onChange(getRawValue(e.target.value));
				} }
				onBlur={ !useRawInputValue ? input.onBlur : (e: SyntheticEvent) => {
					return input.onBlur(getRawValue((e.target as HTMLInputElement).value));
				} }
				disabled={ disabled }
				autoFocus={ autoFocus }
			/>
		)
	}

Input.defaultProps = {
	type: InputType.text,
};

export default Input;
