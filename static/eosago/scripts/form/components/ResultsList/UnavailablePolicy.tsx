import { FlexboxGrid, FlexboxGridItem, Link, Text } from 'react-ui-2018';
import Logo from './Logo';
import React from 'react';

const UnavailablePolicy = ({ policy, isMobile }: any) => {
	return (
		<FlexboxGrid
			direction={ isMobile ? 'vert' : 'row' }
			gap={ isMobile ? 'small' : 'zero' }
			alignItems={ isMobile ? 'stretch' : 'center' }
		>
			<FlexboxGridItem shrinkPriority={ isMobile ? 1 : 2 }>
				<div className={ isMobile ? 'padding-bottom-default border-bottom text-align-center' : '' }>
					<Logo policy={ policy } />
				</div>
			</FlexboxGridItem>

			<FlexboxGridItem>
				<div className={ isMobile ? 'text-align-center' : '' }>
					<div className={ isMobile ? 'padding-bottom-medium' : 'display-inline padding-right-small' }>
						<Text tagName="span" size="5">Предложение отклонено партнёром</Text>
					</div>
					{/* <Link size={ isMobile ? 'xsmall' : 'small' } onClick={ () => {} } theme="alt">Подробнее</Link> */}
				</div>
			</FlexboxGridItem>
		</FlexboxGrid>
	)
};

export default UnavailablePolicy;
