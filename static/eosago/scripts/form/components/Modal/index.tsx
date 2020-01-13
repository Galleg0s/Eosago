import React, { Component } from 'react';
import classNames from 'classnames';

import {
	FlexboxGrid,
	Link,
	Tooltip,
	Icon,
	Modal as ModalUI,
	ModalBody,
	ModalHeader, Text,
} from 'react-ui-2018';

import AutoIcon from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/results/auto.svg';
import CalculationIcon from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/results/calculation.svg';
import InformationIcon from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/results/information.svg';

import styles from './styles.ts.module.styl';

// @todo выводить строки в цикле после добавления данных
class Modal extends Component<any, any> {
	render() {
		const { isMobile } = this.props;

		const nameCls = classNames(
			isMobile ? 'padding-bottom-default' : 'padding-bottom-small'
		);

		const itemCls = classNames(
			isMobile ? 'padding-bottom-default' : 'padding-bottom-medium',
			'text-size-5',
		);

		const textCls = classNames(
			isMobile ? 'padding-top-medium ' : 'padding-top-x-small',
			'text-size-6',
		);

		const featureCls = classNames(
			isMobile ? 'padding-right-medium' : 'padding-right-small'
		);

		const iconCls = classNames(
			'padding-vert-xx-small va-middle',
			isMobile ? 'padding-right-medium' : 'padding-right-x-small',
			styles.icon,
		);

		const tooltipCls = classNames(
			'color-silver-alpha-70',
			isMobile ? 'margin-left-small' : 'margin-left-xx-small',
		);

		return (
			<ModalUI
				isOpen={ this.props.isModalOpen }
				closeHandler={ this.props.closeModal }
				isCloseIcon={ true }
				width="640px"
				contentPadding
				dialogShadow
			>
				<ModalHeader>Параметры расчёта</ModalHeader>
				<ModalBody>
					<FlexboxGrid direction="vert" gap={ isMobile ? 'small' : 'default' }>
						<div className="padding-top-default border-top-colorMinorGrayLighten">
							<div className={ nameCls }>
								<img
									className={ iconCls }
									src={ CalculationIcon }
									alt="Расчёт КБМ"
								/>
								<span className="padding-bottom-x-small text-size-5 text-weight-bolder">
									Расчет КБМ
									<Tooltip content="info" position="top" trigger="mouseenter">
										<span className={ tooltipCls }><Icon type="danger-24" size="medium" /></span>
									</Tooltip>
								</span>
							</div>

							<div className={ itemCls }>
								<Text tagName="p" size="5">
									Константинопольский Константин Константинович
								</Text>

								<div className={ textCls }>
									<span className={ featureCls }>
										<span className="color-minor-black-lighten">КБМ:</span> <b>3</b>
									</span>
										<span className={ featureCls }>
										<span className="color-minor-black-lighten">Скидка за КБМ:</span> <b>Отсутствует</b>
									</span>
										<span className={ featureCls }>
										<span className="color-minor-black-lighten">Стоимость:</span> <b>от 11 345 ₽</b>
									</span>
								</div>
							</div>

							<div className={ itemCls }>
								<Text tagName="p" size="5">
									Константинопольский Константин Константинович
								</Text>

								<div className={ textCls }>
									<span className={ featureCls }>
										<span className="color-minor-black-lighten">КБМ:</span> <b>3</b>
									</span>
									<span className={ featureCls }>
										<span className="color-minor-black-lighten">Скидка за КБМ:</span> <b>Отсутствует</b>
									</span>
									<span className={ featureCls }>
										<span className="color-minor-black-lighten">Стоимость:</span> <b>от 11 345 ₽</b>
									</span>
								</div>
							</div>
							<Link size={ isMobile ? 'xsmall' : 'small' } onClick={ () => {} } theme="alt">Изменить</Link>
						</div>

						<div className="padding-top-default border-top-colorMinorGrayLighten">
							<div className={ nameCls }>
								<img
									className={ iconCls }
									src={ AutoIcon }
									alt="Автомобиль"
								/>

								<span className="padding-bottom-x-small text-size-5 text-weight-bolder">Автомобиль</span>
							</div>

							<div className={ itemCls }>
								<Text tagName="p" size="5">
									HONDA Accord, 2011 г.в., 200 л.с. <br />
									СТС:123132423423452345, <br />
									VIN: 12233434444,
								</Text>
							</div>

							<Link size={ isMobile ? 'xsmall' : 'small' } onClick={ () => {} } theme="alt">Изменить</Link>
						</div>

						<div className="padding-top-default border-top-colorMinorGrayLighten">
							<div className={ nameCls }>
								<img className={ iconCls } src={ InformationIcon } alt="Условия" />
								<span className="padding-bottom-x-small text-size-5 text-weight-bolder">Условия</span>
							</div>

							<div className={ itemCls }>
								<Text tagName="p" size="5">
									Период страхования с 27.09.2019 по 26.09.2020
								</Text>
							</div>

							<Link size={ isMobile ? 'xsmall' : 'small' } onClick={ () => {} } theme="alt">Изменить</Link>
						</div>
					</FlexboxGrid>
				</ModalBody>
			</ModalUI>
		)
	}
}


export default Modal;
