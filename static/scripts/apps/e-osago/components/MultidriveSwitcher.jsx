import React from 'react';
import classNames from 'classnames';

import FormSection from '../layout/FormSection.jsx';

function MultidriveSwitcher(props) {
	const { value, items, changeHandler, isMobile } = props;

	function getCls(item) {
		return classNames('switcher__button', {
			'switcher__button--active': item.value === value,
			'padding-top-xx-small padding-bottom-xx-small': isMobile
		});
	}

	return (
		<FormSection name="Допущено к управлению">
			<ul className="ui-button-switcher margin-bottom-default">
				{ items.map((item, index) => (
					<li key={ index } className={ getCls(item) } onClick={ changeHandler.bind(null, item.value) }>{ item.title }</li>
				))}
			</ul>
		</FormSection>
	);
}

export default MultidriveSwitcher;
