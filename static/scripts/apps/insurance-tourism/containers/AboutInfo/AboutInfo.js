import React, { Component } from 'react';
import {
	Accordion,
	GridWrapper,
	GridRow,
	GridCol
} from 'react-ui-2018';

const data = [{
	header: 'Зачем страховаться при выезде за рубеж',
	body: 'Туристическая страховка позволяет получить бесплатную медицинскую помощь в стране пребывания.'
}, {
	header: 'Как воспользоваться страховкой',
	body: 'Необходимо позвонить в сервисную компанию по телефону, указанному в страховке и следовать указаниям сотрудника сервисной компании.',
}, {
	header: 'Какие риски покрывает страховка',
	body: 'Базовый полис ВЗР включает только лечение, экстренную стоматологию и медицинскую транспортировку.'
}, {
	header: 'Чем можно дополнить страховку',
	body: 'Полис можно дополнить страхованием багажа, страхованием при занятиях спортом,  страхованием от невыезда и задержки рейса и др.'
}];

function AboutInfo() {
	return (
		<GridWrapper>
			<GridRow>
				<GridCol xs={ 4 }>
					<h2 className="text-size-2 text-weight-bold text-align-center margin-vert-small">
						Туристическая страховка
					</h2>
				</GridCol>
			</GridRow>
			<GridRow>
				<GridCol xs={ 4 }>
					<Accordion
						data={ data }
						isMobile
					/>
				</GridCol>
			</GridRow>
		</GridWrapper>
	);
}

export default AboutInfo;
