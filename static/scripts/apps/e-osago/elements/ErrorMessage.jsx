'use strict';

import React from 'react';

function ErrorMessage(props) {
	const { message, ...otherProps } = props;

	if (!message) {
		return null;
	}

	return (
		<div className="color-red margin-top-xx-small" data-error-message { ...otherProps }>
			{ message }
		</div>
	);
}

export default ErrorMessage;
