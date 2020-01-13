import React, { Fragment } from 'react';
import { moneyFormat } from 'helpers';
import { Button, FormField, InputLabel } from 'react-ui-2018';
import { EMAIL_ERROR_MESSAGE, PHONE_ERROR_MESSAGE } from '../constants';
import InputMask from 'react-input-mask';

export default function PurchaseForm(props) {
	const { changeHandler, purchaseHandler, trackingClick, purchaseUrl, email, emailStatus, phone, phoneStatus, price, loadingPurchase } = props;
	const isMobile = banki.env.isMobileDevice;

	return (
		<div>
			{ isMobile ? (
				<div className="margin-bottom-default">
					<span className="text-size-5 color-gray-alpha-60">
						Стоимость полиса
					</span>
					<span className="text-size-1 font-bold padding-left-medium">
						{ moneyFormat(Math.ceil(price)) } ₽
					</span>
				</div>
			) : (
				<Fragment>
					<div className="text-size-6 color-gray-alpha-60 margin-bottom-x-small">
						Стоимость полиса
					</div>
					<div className="text-size-2 font-bold margin-bottom-small">
						{ moneyFormat(Math.ceil(price)) } ₽
					</div>
				</Fragment>
			) }
			<div className="margin-bottom-small-fixed">
				<InputLabel size="medium" htmlFor="phone-prolongation">
					<div className="color-major-black text-weight-bolder margin-bottom-x-small">Телефон</div>
				</InputLabel>
				<FormField
					id="phone-prolongation"
					name="phone"
					onChange={ changeHandler }
					value={ phone }
					size="medium"
					placeholder="+7 (926) 777 77 77"
					status={ { type: phoneStatus, message: phoneStatus === 'error' ? PHONE_ERROR_MESSAGE : '' } }
					inputComponent={ InputMask }
					mask={ '+7 999 999 99 99' }
					alwaysShowMask={ true }
					maskChar={ null }
					inputmode="numeric"
					disabled={ loadingPurchase || purchaseUrl }
				/>
			</div>
			<div className="margin-bottom-default">
				<InputLabel size="medium" htmlFor="email-prolongation">
					<div className="color-major-black text-weight-bolder margin-bottom-x-small">E-mail</div>
				</InputLabel>
				<FormField
					id="email-prolongation"
					name="email"
					onChange={ changeHandler }
					value={ email }
					size="medium"
					placeholder="banki@banki.ru"
					status={ { type: emailStatus, message: emailStatus === 'error' ? EMAIL_ERROR_MESSAGE : '' } }
					inputComponent={ InputMask }
					maskChar={ null }
					disabled={ loadingPurchase || purchaseUrl }
				/>
			</div>
			{ purchaseUrl ? (
				<Button
					theme="orange"
					href={ purchaseUrl }
					size={ isMobile ? 'large' : 'medium' }
					fullWidth={ isMobile }
					onClick={ trackingClick }
				>
					Перейти к оплате
				</Button>
			) : (
				<Button
					theme="blue"
					size={ isMobile ? 'large' : 'medium' }
					fullWidth={ isMobile }
					isLoading={ loadingPurchase }
					onClick={ purchaseHandler }
					disabled={ emailStatus === 'error' || phoneStatus === 'error' }
				>
					Оплатить полис
				</Button>
			) }
		</div>
	)
}
