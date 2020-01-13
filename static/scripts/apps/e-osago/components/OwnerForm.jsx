import React, { Component } from 'react';
import classNames from 'classnames';

import Field from '../layout/Field.jsx';
import InputText from '../elements/InputText.jsx';
import InputCalendar from '../elements/InputCalendar.jsx';
import InputSeriesNumber from '../elements/InputSeriesNumber.jsx';
import ErrorMessage from '../elements/ErrorMessage.jsx';

import { InputDropdownSelectAddress } from 'react-ui';
import { getAddressValue, setKladrIdToLocations } from '../utils.js';

class OwnerForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowConfirmPhone: false,
			isPhoneDisabled: false,
			isCodeFilled: false,
			isAvailableSmsCodeAgain: false,
		};
		this.toggleIsShowConfirmPhoneHandler = this.toggleIsShowConfirmPhoneHandler.bind(this);
		this.toggleIsPhoneDisabledHandler = this.toggleIsPhoneDisabledHandler.bind(this);
		this.toggleIsSmsCodeDisabledHandler = this.toggleIsSmsCodeDisabledHandler.bind(this);
		this.toggleIsAvailableSmsCodeAgainHandler = this.toggleIsAvailableSmsCodeAgainHandler.bind(this);
		this.changeEventHandler = this.changeEventHandler.bind(this);
		this.changeAddressEventHandler = this.changeAddressEventHandler.bind(this);
		this.changeRegistrationAddressHandler = this.changeRegistrationAddressHandler.bind(this);
		this.houseInputClearHandler = this.houseInputClearHandler.bind(this);
	}

	toggleIsShowConfirmPhoneHandler(isShowConfirmPhone) {
		this.setState({ isShowConfirmPhone });
	}

	toggleIsPhoneDisabledHandler(isPhoneDisabled) {
		this.setState({ isPhoneDisabled });
	}

	toggleIsSmsCodeDisabledHandler(isSmsCodeDisabled) {
		this.setState({ isSmsCodeDisabled: isCodeFilled });
	}

	toggleIsAvailableSmsCodeAgainHandler(isAvailableSmsCodeAgain) {
		this.setState({ isAvailableSmsCodeAgain });
	}

	get addressErrorMessage() {
		const { data } = this.props;

		let commonMsg = 'Введите корректный адрес';

		if (data.registration_settlement !== undefined || data.registration_city !== undefined) {
			if (!data.registration_settlement && !data.registration_city) {
				return `${commonMsg}: не выбран город или поселок`;
			}
		}

		if (data.registration_house !== undefined && !data.registration_house) {
			return `${commonMsg}: не выбран № дома`;
		}

		if (data.registration_flat !== undefined && !Number.isInteger(Number(data.registration_flat))) {
			return `${commonMsg}: квартира должна быть целым числом`
		}

		return null;
	}

	get addressField() {
		const {
			data,
			eosagoPage,
			ownerIsAnInsurant,
		} = this.props;

		if (ownerIsAnInsurant) {
			return (
				<InputText
					className="input--full-width"
					value={ data.addressValue }
					disabled={ true }
				/>
			)
		}

		const addressValue = getAddressValue(data);

		if (eosagoPage) {
			return (
				<InputDropdownSelectAddress
					changeHandler={ this.changeRegistrationAddressHandler }
					inputValue={ data.addressValue }
					defaultValue={ addressValue }
				/>
			)
		} else {
			return (
				<InputDropdownSelectAddress
					changeHandler={ this.changeRegistrationAddressHandler }
					inputValue={ data.addressValue }
				/>
			)
		}
	}

	changeEventHandler(event) {
		const {
			changeHandler
		} = this.props;

		let target = event.target;
		let type = target.type || 'text';
		let name = target.name || 'unnamed';
		let valueProp = type === 'checkbox' ? 'checked' : 'value';
		let value = target[valueProp];

		changeHandler(name, value);
	}

	/*
	 * @params {Object} address: dadata response https://dadata.ru/api/clean/#response-address
	 * @params {String} type: 'registration' || 'actual'
	 */
	changeAddressEventHandler = address => {
		this.changeEventHandler({
			target: {
				name: 'addressValue',
				value: address.name,
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_area',
				value: address.area,
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_region_with_type',
				value: address.region_with_type || ''
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_region',
				value: address.region,
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_region_kladr_id',
				value: address.region_kladr_id
			}
		});
		const city = `${address.city ? `${address.city_with_type} ` : ''}${address.area ? `${address.area_with_type} ` : ''}${address.settlement ? `${address.settlement_with_type} ` : ''}`;
		this.changeEventHandler({
			target: {
				name: 'registration_city_with_type',
				value: city.trim()
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_city',
				value: address.city,
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_city_kladr_id',
				value: address.city_kladr_id
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_settlement_with_type',
				value: address.settlement_with_type || ''
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_settlement',
				value: address.settlement || ''
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_settlement_code_kladr',
				value: address.settlement_kladr_id
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_area',
				value: address.area_with_type || ''
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_area_kladr_id',
				value: address.area_kladr_id
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_street_with_type',
				value: address.street_with_type || ''
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_street',
				value: address.street,
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_street_kladr_id',
				value: address.street_kladr_id
			}
		});
		const house = address.house ? `${address.house_type || ''} ${address.house || ''} ${address.block_type || ''} ${address.block || ''}` : '';
		this.changeEventHandler({
			target: {
				name: 'registration_house_with_type',
				value: house.trim()
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_house',
				value: address.house,
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_building',
				value: `${address.block_type || ''} ${address.block || ''}`.trim(),
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_flat',
				value: address.flat
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_postcode',
				value: address.postal_code || ''
			}
		});
	};

	/*
	 * Хэндлер изменения адреса регистрация
	 * @function
	 */
	changeRegistrationAddressHandler(address, error, field) {
		if (this.props.eosagoPage && error) {
			return this.changeAddressEventHandler(address, field);
		}
		return this.changeAddressEventHandler(address);
	}

	houseInputClearHandler() {
		this.changeEventHandler({
			target: {
				name: 'registration_house',
				value: null
			}
		});
		this.changeEventHandler({
			target: {
				name: 'registration_block',
				value: null
			}
		});
	}

	render() {
		const {
			data,
			errors,
			ownerIsAnInsurant,
			eosagoPage,
		} = this.props;

		const today = new Date();

		return (
			<div className="grid__row grid__row--v-default">
				<div className="grid__cell grid__cell--12">
					<Field name="Фамилия">
						<InputText
							className={ classNames('input--full-width', {'input--alert': data.lastname !== undefined && errors.lastname}) }
							name="lastname"
							value={ data.lastname }
							onChange={ this.changeEventHandler }
							disabled={ ownerIsAnInsurant }
						/>
						<ErrorMessage message={ data.lastname !== undefined && errors.lastname } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Имя">
						<InputText
							className={ classNames('input--full-width', {'input--alert': data.firstname !== undefined && errors.firstname}) }
							name="firstname"
							value={ data.firstname }
							onChange={ this.changeEventHandler }
							disabled={ ownerIsAnInsurant }
						/>
						<ErrorMessage message={ data.firstname !== undefined && errors.firstname } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Отчество">
						<InputText
							className={ classNames('input--full-width', {'input--alert': data.patronymic !== undefined && errors.patronymic}) }
							name="patronymic"
							value={ data.patronymic }
							onChange={ this.changeEventHandler }
							disabled={ ownerIsAnInsurant }
						/>
						<ErrorMessage message={ data.patronymic !== undefined && errors.patronymic } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Пол">
						<label className="margin-right-default">
							<input
								className="modern-radio-button"
								type="radio"
								name="gender"
								value="m"
								checked={ data.gender === 'm' }
								onChange={ this.changeEventHandler }
								disabled={ ownerIsAnInsurant }
							/>
							<span className="radio-button-label">Мужской</span>
						</label>
						<label>
							<input
								className="modern-radio-button"
								type="radio"
								name="gender"
								value="f"
								checked={ data.gender === 'f' }
								onChange={ this.changeEventHandler }
								disabled={ ownerIsAnInsurant }
							/>
							<span className="radio-button-label">Женский</span>
						</label>
						<ErrorMessage message={ Object.keys(errors).length === 1 && errors.gender } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Дата рождения">
						<InputCalendar
							name="birthday"
							value={ data.birthday }
							error={ data.birthday !== undefined && errors.birthday }
							selectedDate={ {day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() - 18} }
							startDate={ {day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() - 90} }
							endDate={ {day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() - 18} }
							onChange={ this.changeEventHandler }
							disabled={ ownerIsAnInsurant }
						/>
						<ErrorMessage message={ data.birthday !== undefined && errors.birthday } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Паспорт">
						<InputSeriesNumber
							name="passport"
							values={ {series: data.passport_series, number: data.passport_number} }
							onChange={ this.changeEventHandler }
							errors={ errors }
							masks={ {series: '99 99', number: '999999'} }
							disabled={ ownerIsAnInsurant }
						/>
						<ErrorMessage message={ data.passport_series !== undefined && ((data.passport_number !== undefined && errors.passport_number) || errors.passport_series) } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Дата выдачи">
						<InputCalendar name="passport_issue_date"
							value={ data.passport_issue_date }
							error={ data.passport_issue_date !== undefined && errors.passport_issue_date }
							endDate={ { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() } }
							onChange={ this.changeEventHandler }
							disabled={ ownerIsAnInsurant }
						/>
						<ErrorMessage message={ data.passport_issue_date !== undefined && errors.passport_issue_date } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Кем выдан">
						<textarea
							className={ classNames('input--full-width', {'input--alert': data.passport_emitent !== undefined && errors.passport_emitent}) }
							name="passport_emitent"
							value={ data.passport_emitent || '' }
							onChange={ this.changeEventHandler }
							disabled={ ownerIsAnInsurant }
							style={ {resize: 'none'} }
						/>
						<ErrorMessage message={ data.passport_emitent !== undefined && errors.passport_emitent } />
					</Field>
				</div>

				<div className="grid__cell grid__cell--12">
					<div className="header-h3 margin-top-default">Адрес регистрации</div>
				</div>
				<div className="grid__cell grid__cell--12">
					{this.addressField}
					<ErrorMessage message={ this.addressErrorMessage } />
				</div>
			</div>
		);
	}
}

export default OwnerForm;
