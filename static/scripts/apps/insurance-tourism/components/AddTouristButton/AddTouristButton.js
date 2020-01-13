import React from 'react';
import T from 'prop-types';
import { Link } from 'react-ui-2018';

export default function AddTouristButton({ onClick }) {
	return (
		<Link
			onClick={ onClick }
			leftIcon="add-user"
			iconColor="major-blue"
		>
			Добавить туриста
		</Link>
	);
}

AddTouristButton.propTypes = {
	onClick: T.func,
};

AddTouristButton.defaultProps = {
	onClick: () => {},
};
