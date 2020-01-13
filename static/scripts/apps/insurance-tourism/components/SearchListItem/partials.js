/* eslint-disable react/no-multi-comp */
import React from 'react';
import { IconButton, Tooltip } from 'react-ui-2018';

export const renderRatingTooltip = () => (
	<Tooltip
		content="Рейтинг финансовой надежности страховой компании представляет собой мнение рейтингового агентства «Эксперт РА» о способности выполнения страховой компанией ее текущих и будущих обязательств перед страхователями и выгодоприобретателями в рамках договоров страхования, сострахования и перестрахования и не распространяется на прочие обязательства."
		position="top"
		trigger="mouseenter"
	>
		<IconButton icon="info" size="medium" />
	</Tooltip>
);

export const renderAssistanceTooltip = () => (
	<Tooltip
		content="Сервисная компания, организующая медицинскую помощь при наступлении страхового случая."
		position="top"
		trigger="mouseenter"
	>
		<IconButton icon="info" size="medium" />
	</Tooltip>
);
