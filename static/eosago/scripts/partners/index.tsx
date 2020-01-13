import React from 'react';
import ReactDOM from 'react-dom';
import { Slider } from 'react-ui-2018';
import styles from './styles.ts.module.styl';

import rosgosstrakh from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/rosgosstrakh.svg';
import alpha from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/alpha.svg';
import bin from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/bin.svg';
import bsd from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/bsd.svg';
import osk from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/osk.svg';
import renessans from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/renessans.svg';
import reso from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/reso.svg';
import soglasie from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/soglasie.svg';
import tinkoff from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/tinkoff.svg';
import verna from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/verna.svg';
import vsk from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/vsk.svg';
import zetta from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/zetta.svg';
import ingosstakh from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/ingosstakh.svg';

const banks = [{
	logo: soglasie,
	title: 'Согласие',
},	{
	logo: rosgosstrakh,
	title: 'Росгосстрах',
},	{
	logo: ingosstakh,
	title: 'Ингосстрах'
}, {
	logo: vsk,
	title: 'ВСК',
},	{
	logo: tinkoff,
	title: 'Тинькофф страхование',
},	{
	logo: alpha,
	title: 'Альфастрахование',
},	{
	logo: bin,
	title: 'БИН',
},	{
	logo: bsd,
	title: 'БСД',
},	{
	logo: osk,
	title: 'ОСК',
},	{
	logo: renessans,
	title: 'Ренессанс',
},	{
	logo: reso,
	title: 'Ресо',
},	{
	logo: verna,
	title: 'Верна',
},	{
	logo: zetta,
	title: 'Зетта',
}];

const SliderWrapper = () => (
	<Slider
		mode="carousel"
		withNavigation
		options={ {
			spaceBetween: 1,
			breakpoints: {
				1100: {
					slidesPerGroup: 2,
					slidesPerView: 4
				},
				700: {
					slidesPerGroup: 2,
					slidesPerView: 3
				},
				500: {
					slidesPerGroup: 2,
					slidesPerView: 3,
				}
			},
			slidesPerView: 5,
		} }
	>
		{ banks.map((bank) => (
			<Slider.Item key={ bank.title }>
				<img
					className={ styles.logo }
					src={ bank.logo }
					title={ bank.title }
					alt={ bank.title }
				/>
			</Slider.Item>
		))}
	</Slider>
);


const render = (container: HTMLElement) => {
	ReactDOM.render(
		<SliderWrapper />,
		container
	)
};

export default render;
