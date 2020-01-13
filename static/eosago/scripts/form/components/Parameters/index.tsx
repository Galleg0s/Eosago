import React, { Component } from 'react';
import classNames from 'classnames';

import {
	FlexboxGrid,
	FlexboxGridItem,
	Link,
	Tooltip,
	Icon,
} from 'react-ui-2018';

import AutoIcon from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/results/auto.svg';
import CalculationIcon from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/results/calculation.svg';
import styles from './styles.ts.module.styl';

const CalculationData = () => (
	<FlexboxGrid alignItems="flex-start" gap="small">
		<FlexboxGridItem min>
			<img
				className="padding-hor-x-small padding-vert-xx-small"
				src={ CalculationIcon }
				alt="Расчёт КБМ"
			/>
		</FlexboxGridItem>
		<FlexboxGridItem>
			<h3 className="padding-bottom-x-small text-size-5 text-weight-bolder">
				Расчет КБМ
				<Tooltip content="info" position="top" trigger="mouseenter">
					<span className="margin-left-xx-small color-silver-alpha-70">
						<Icon
							type="danger-24"
							size="medium"
						/>
					</span>
				</Tooltip>
			</h3>
			<div className="padding-bottom-small text-size-6">
				<span className="padding-right-small">
					<span>КБМ:</span> <b>3</b>
				</span>
				<span className="padding-right-small">
					<span>Скидка за КБМ:</span> <b>Отсутствует</b>
				</span>
				<span className="padding-right-small">
					<span>Стоимость:</span> <b>от 11 345 ₽</b>
				</span>
			</div>
			<Link size="small" onClick={ () => {} } theme="alt">Подробнее</Link>
		</FlexboxGridItem>
	</FlexboxGrid>
);

const VehicleData = () => (
	<div className="border-right-colorMinorGrayLighten padding-right-default">
		<FlexboxGrid alignItems="flex-start" gap="small">
			<FlexboxGridItem min>
				<img
					className="padding-hor-x-small padding-vert-xx-small"
					src={ AutoIcon }
					alt="Данные автомобиля"
				/>
			</FlexboxGridItem>
			<FlexboxGridItem>
				<h3 className="padding-bottom-x-small text-size-5 text-weight-bolder">Параметры расчёта</h3>
				<p className="padding-bottom-small text-size-6">
					HONDA Accord, 2011 г.в., 200 л.с. 2 водителя. Период страхования с 27.09.2019 по 26.09.2020
				</p>
				<Link size="small" onClick={ () => {} } theme="alt">Подробнее</Link>
			</FlexboxGridItem>
		</FlexboxGrid>
	</div>
);

class Parameters extends Component<any, any> {
	render() {
		const isMobile = this.props.isMobile;

		const panelCls = classNames(
			'bg-white shadow-level-1',
		);

		const desktopRootCls = classNames(
			'margin-bottom-default padding-default border-radius-default cursor-pointer',
			panelCls,
		);

		const rootCls = classNames(
			isMobile ? 'margin-bottom-medium' : desktopRootCls,
		);

		const separatorCls = classNames(
			'bg-minor-gray-lighten',
			styles.separator,
		);

		const linkCls = classNames(
			'padding-vert-medium text-align-center',
			panelCls,
		);

		return (
			<div className={ rootCls } onClick={ isMobile ? (() => {}) : this.props.openModal }>
				<FlexboxGrid justifyContent="space-between" gap={ isMobile ? 'zero' : 'default' } equalWidth >
					{ isMobile
						? (
							<>
								<div className={ classNames('border-right-colorMinorGrayLighten', linkCls) }>
									<Link onClick={ this.props.openModal } size="xsmall">Параметры расчёта</Link>
								</div>

								<div className={ linkCls }>
									<Link href={ '/insurance/' } size="xsmall">Новый расчёт</Link>
								</div>
							</>
						) : (
							<>
								<VehicleData />
								<CalculationData />
							</>
						)
					}

				</FlexboxGrid>
			</div>
		)
	}
}


export default Parameters;
