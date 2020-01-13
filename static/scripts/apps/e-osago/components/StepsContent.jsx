import React from 'react';

import ContentWrapper from '../layout/ContentWrapper.jsx';

function StepsContent(props) {
	const { current, children } = props;

	return (
		<ContentWrapper>
			{ React.Children.toArray(children).map((child, index) => {
				if (index === current) {
					return (
						<div key={ index }>
							{ child }
						</div>
					)
				}
			}) }
		</ContentWrapper>
	);
}

export default StepsContent;
