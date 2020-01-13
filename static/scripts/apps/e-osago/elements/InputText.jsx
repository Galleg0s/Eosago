import React from 'react';

function InputText(props) {
	const { value, onChange, ...rest } = props;

	return (
		<input
			type="text"
			value={ value || '' }
			onChange={ onChange }
			{ ...rest }
		/>
	);
}

export default InputText;
