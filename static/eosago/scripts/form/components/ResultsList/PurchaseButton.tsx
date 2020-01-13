import { Button, FlexboxGridItem } from 'react-ui-2018';
import React from 'react';

interface Props {
	isMobile: boolean,
	btnClickHandler: () => void;
	isLoading: boolean;
}

const PurchaseButton = ({ isMobile, btnClickHandler, isLoading }: Props) => {
	return (
		<FlexboxGridItem min={ !isMobile }>
			<Button
				theme="orange"
				fullWidth={ isMobile }
				onClick={ !isLoading && btnClickHandler }
				isLoading={ isLoading }
			>
				Оформить полис
			</Button>
		</FlexboxGridItem>
	)
};

export default PurchaseButton;
