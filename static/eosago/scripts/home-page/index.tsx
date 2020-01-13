import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import router, { Query } from 'router';
import React, {SyntheticEvent, useState} from 'react';

import { Button, GridVertical, GridRow, GridCol, FormField, Text, Link } from 'react-ui-2018';
import Media from 'react-media';
import classNames from 'classnames';
import styles from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/home-page/styles.ts.module.styl';
import { mediaQuery } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/home-page/constants';
import backgroundImg from '@BUNDLES/InsuranceBundle/Resources/static/eosago/images/home/car.png';

function Home() {
	const [licensePlate, setLicensePlate] = useState('');
	const [status, setStatus] = useState({type: 'default', message: ''});
	const LICENSE_PLATE_MIN_LENGTH = 11;

	const inputChangeHandler = (e: SyntheticEvent<HTMLInputElement>) => {
		if (e.currentTarget.value.length >= LICENSE_PLATE_MIN_LENGTH && status.type === 'error') {
			setStatus({ type: 'default', message: '' });
		}
		setLicensePlate(e.currentTarget.value.toUpperCase());
	};

	const redirectToForm = (query?: Query) => {
		const licensePlateQuery = query && query.licensePlate ? { licensePlate: query.licensePlate.replace(/\s/g, '') } : undefined;
		window.location.href = router.generate('bankiru_insurance_eosago_redesign_form', licensePlateQuery);
	}

	const inputBlurHandler = (e: SyntheticEvent<HTMLInputElement>) => {
		if (e.currentTarget.value.length < LICENSE_PLATE_MIN_LENGTH) {
			setStatus({ type: 'error', message: 'Укажите корректный номер' })
		}
	};

	return (
		<Media queries={ { isMobile: mediaQuery.hxs, isTablet: mediaQuery.md} }>
			{ (matches: any) => {
				const { isMobile, isTablet } = matches;

				return (
					<div className={ classNames({ 'text-align-center': isMobile }) }>
						<GridRow>
							<GridCol sm={ 4 } xl={ 8 }>
								<GridVertical>
									<GridRow>
										<GridCol xs={ 4 } sm={ 8 } md={ 12 } xl={ 16 }>
											<Text tagName="div" size="4">
												Введите номер автомобиля, мы сами заполним данные о модификации
											</Text>
										</GridCol>
									</GridRow>
									<GridRow>
										<GridCol xs={ 4 } sm={ 4 } md={ 6 } lg={ 5 } lgAlign="baseline" xl={ 7 }>
											<div className={ classNames({ 'margin-bottom-default': isMobile }) }>
												<FormField
													size={ isMobile ? 'medium' : 'large' }
													onChange={ inputChangeHandler }
													onBlur={ inputBlurHandler }
													placeholder="А 000 АА 177"
													value={ licensePlate }
													centeredPlaceholder={ isMobile }
													additionalFormatChars={ {
														g: '[АВЕКМНОРСТУХавекмнорстух]'
													} }
													mask="g 999 gg 999"
													status={ status }
												/>
											</div>
										</GridCol>
										<GridCol xs={ 4 } sm={ 4 } md={ 6 } lg={ 3 } xl={ 4 }>
											<div className={ classNames({ 'margin-bottom-default': isTablet }) }>
												<Button
													size="large"
													onClick={ () => {
														redirectToForm(licensePlate ? { licensePlate } : undefined);
													} }
													fullWidth={ isMobile }
													disabled={ status.type === 'error' }
												>
													Рассчитать
												</Button>
											</div>
										</GridCol>
										<GridCol xs={ 4 } sm={ 4 } md={ 12 } lg={ 4 } lgAlign="baseline" xl={ 5 }>
											<Text size="5" tagName="div">
												<span>или <Link type="text" onClick={ () => redirectToForm() }>выберите</Link> марку</span>
												{ isMobile && <span> самостоятельно</span> }
											</Text>
										</GridCol>
									</GridRow>
								</GridVertical>
							</GridCol>
							{ !isMobile && (
								<GridCol sm={ 4 } xl={ 8 }>
									<img className={ styles.background } src={ backgroundImg } alt="Страхование" />
								</GridCol>
							)}
						</GridRow>
					</div>
				)
			}}
		</Media>
	);
}

const render = (element: HTMLElement) => {
	ReactDOM.render(
		<AppContainer>
			<Home />
		</AppContainer>,
		element
	);
};

export default render;
