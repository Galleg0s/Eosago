import React from 'react';
import classNames from 'classnames';
import { Popup, Button } from 'react-ui';

const data = {
	title: 'Что такое электронный полис ОСАГО (е-ОСАГО)',
	description: `Электронный полис является полным аналогом бумажного полиса и отличается только способом
					покупки. В соответствии с Федеральным законом от 23 июня 2016 г. №214-ФЗ о внесении
					изменений в ФЗ №40 «Об ОСАГО», любой автовладелец имеет право заключить договор ОСАГО в электронной
					форме.`,
	benefits: [
		{
			title: '100% защита от подделки',
			text: 'Полис сразу после отплаты попадает в базу РСА.',
			img: require('../../../../images/about-eosago-01.svg')
		},
		{
			title: 'Минимум времени',
			text: 'Полис придет на ваш e-mail сразу после оплаты.',
			img: require('../../../..//images/about-eosago-02.svg')
		},
		{
			title: 'Полис всегда доступен',
			text: 'Если потеряли полис, просто распечатайте бланк еще раз.',
			img: require('../../../../images/about-eosago-03.svg')
		},
		{
			title: 'Легко продлить',
			text: 'Не нужно заново вводить данные: просто выберите компанию и оплатите полис.',
			img: require('../../../../images/about-eosago-04.svg')
		}
	]
};

export default function AboutEOSAGOPopup(props) {
	const isMobile = banki.env.isMobileMode;
	const containerClasses = classNames('flexbox', { 'flexbox--row': !isMobile }, { 'flexbox--gap_default': !isMobile },
		{ 'flexbox--vert': isMobile });

	return (
		<Popup size="large"
			isOpen={ props.isOpen }
			needOverlay={ true }
			centered={ true }
			closeHandler={ props.closeHandler }
			padding={ 'zero' }
		>
			<div className="ui-panel-white padding-default" data-width="434px">
				<div className="ui-panel-gray__title"><div className="header-h2">{ data.title }</div></div>
				<div className="font-size-medium">
					{ data.description }
				</div>
			</div>
			<div className="bg-dark-desaturate padding-default">
				<div className={ containerClasses }>
					{
						data.benefits.map((item, index) => {
							return (
								<div className="flexbox__item color-white font-size-medium" key={ `eosago-benefit-${index}` }>
									<img src={ item.img } />
									<div className="header-h4">{ item.title }</div>
									{ item.text }
								</div>
							);
						})
					}
				</div>
			</div>
			<div className="padding-default">
				<Button theme="blue" clickHandler={ props.closeHandler }>Понятно</Button>
			</div>
		</Popup>
	);
}
