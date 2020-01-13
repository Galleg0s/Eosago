import React, { PureComponent } from 'react';
import { Steps } from 'react-ui-2018';
import s from './HowItWorks.module.styl';

class HowItWorks extends PureComponent {
	render() {
		return (
			<div className="bg-white padding-top-medium-fixed padding-bottom-medium-fixed shadow-level-1">
				<div className="layout-wrapper">
				<Steps
					title="Как купить полис онлайн"
					layoutType="horizontal"
					style="simple"
					list={ [
						{
							description: 'Выберите лучшее предложение'
						},
						{
							description: 'Оплатите картой'
						},
						{
							description: 'Получите полис на e-mail'
						}
					] }
				/>
				</div>
			</div>
		);
	}
}

export default HowItWorks;
