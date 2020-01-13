import React, { FC } from 'react';
import { FlexboxGrid, GridCol, Icon, TextList } from 'react-ui-2018';

export enum BULLET_STATUSES {
	NOT_COMPLETE,
	CURRENT,
	COMPLETE,
}

interface StepItemProps {
	text: string,
	status: BULLET_STATUSES
}

const getBullet = (status: BULLET_STATUSES) => {
	switch (status) {
		case BULLET_STATUSES.NOT_COMPLETE:
			return <Icon size="medium" type="dot-outline" color="minor-gray-lighten" />;
		case BULLET_STATUSES.CURRENT:
			return <Icon size="medium" type="dot-outline" color="major-green" />;
		case BULLET_STATUSES.COMPLETE:
			return <Icon size="medium" type="check" color="major-green" />;
	}
};

const StepItem: FC<StepItemProps> = ({ text, status }) => {
	return (
		<FlexboxGrid gap="xs" alignItems="center">
			{ getBullet(status) }
			<span>{ text }</span>
		</FlexboxGrid>
	)
};

export default StepItem;
