import React from 'react';
import {MarkdownInside} from 'react-ui';
import agreement from '@BUNDLES/InsuranceBundle/Resources/static/scripts/_common/data/agreement.html';

export default function() {
	return (
		<div className="ui-panel-white" data-width="1000px">
			<div className="ui-panel-gray__title"><div className="header-h2">Условия передачи данных</div></div>
			<MarkdownInside html={ agreement } bulletsType="bullet--orange" />
		</div>
	);
}
