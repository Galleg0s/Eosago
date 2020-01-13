import React from 'react';
import InputMask from 'react-input-mask';
import { Input } from 'react-ui-2018';

export default function MaskedInput(props) {
	return (
		<InputMask { ...props }>
			{inputProps => <Input { ...inputProps } />}
		</InputMask>
	);
}
