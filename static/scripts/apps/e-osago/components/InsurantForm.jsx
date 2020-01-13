import React, {Component} from 'react';
import classNames from 'classnames';
import Hash from '../../../_common/utils/hash';

import Field from '../layout/Field.jsx';
import InputText from '../elements/InputText.jsx';
import InputCalendar from '../elements/InputCalendar.jsx';
import InputSeriesNumber from '../elements/InputSeriesNumber.jsx';
import ErrorMessage from '../elements/ErrorMessage.jsx';

import {Button, InputDropdownSelectAddress, Input, Icon, Loader, AlertPanel, utils} from 'react-ui';
import {getAddressValue, scrollToField} from '../utils.js';
import {
	INGOS_COMPANY_ID, ALFA_COMPANY_ID, SOGLASIE_COMPANY_ID, NASKO_COMPANY_ID, RGS_COMPANY_ID, TINKOFF_COMPANY_ID,
	gaCategory,
} from '../constants.js';

const {Timer} = utils;

class InsurantForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowConfirmPhone: false,
			isPhoneDisabled: false,
			isPhoneWarning: false,
			isCodeFilled: false,
			isAvailableSmsCodeAgain: false
		};
		this.toggleIsShowConfirmPhoneHandler = this.toggleIsShowConfirmPhoneHandler.bind(this);
		this.toggleIsPhoneDisabledHandler = this.toggleIsPhoneDisabledHandler.bind(this);
		this.toggleIsSmsCodeDisabledHandler = this.toggleIsSmsCodeDisabledHandler.bind(this);
		this.toggleIsAvailableSmsCodeAgainHandler = this.toggleIsAvailableSmsCodeAgainHandler.bind(this);
		this.changeEventHandler = this.changeEventHandler.bind(this);
		this.changeRegistrationAddressHandler = this.changeRegistrationAddressHandler.bind(this);
		this.checkPhoneNumberField = this.checkPhoneNumberField.bind(this);
		this.checkSmsCodeField = this.checkSmsCodeField.bind(this);
		this._verifyPhoneHandler = this._verifyPhoneHandler.bind(this);
	}

	componentDidMount() {
		const {partner_errors} = this.props;

		if (partner_errors && partner_errors.message) {
			let elemScroll;
			if (partner_errors.form_field === 'phone') {
				elemScroll = document.querySelector('[name=phone]');
			}
			if (partner_errors.form_field === 'email') {
				elemScroll = document.querySelector('[name=email]');
			}
			if (partner_errors.form_field === 'passport_series') {
				elemScroll = document.querySelector('[name=passport]');
			}
			if (partner_errors.form_field === 'birthday') {
				elemScroll = document.querySelector('[name=birthday]');
			}

			elemScroll && scrollToField(elemScroll);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isPhoneVerified &&
			nextProps.isPhoneVerified === true &&
			nextProps.isPhoneVerified !== this.props.isPhoneVerified) {

			dataLayer.push({
				event: 'GTM_event',
				eventCategory: gaCategory,
				eventAction: 'e-OSAGO_phone_confirmed',
				eventLabel: undefined,
				eventValue: undefined
			});

			let trackingUrl = 'https://tracking.banki.ru/';

			const trackingUrlForCompany = {
				[INGOS_COMPANY_ID]: 'GLpX',  // Ингосстрах
				[ALFA_COMPANY_ID]: 'GLpP',  // АльфаСтрахование
				[TINKOFF_COMPANY_ID]: 'GL1K5',  // Тинькофф
				[RGS_COMPANY_ID]: 'GL1L7',  // РГС
				[SOGLASIE_COMPANY_ID]: 'GL1S7',  // Согласие
				[NASKO_COMPANY_ID]: 'SL1Ua',  // НАСКО
			};

			const calculationHash = Hash.get();
			const calculationHashArray = calculationHash && calculationHash.split(':');
			const calculationId = calculationHashArray && calculationHashArray[0];

			trackingUrl += `${trackingUrlForCompany[this.props.companyId]}?adv_sub=${calculationId}`;

			const trackingElement = new Image();
			trackingElement.src = trackingUrl;
		}
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
			eosagoPage
		} = this.props;

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

	toggleIsShowConfirmPhoneHandler(isShowConfirmPhone) {
		this.setState({isShowConfirmPhone});
	}

	toggleIsPhoneDisabledHandler(isPhoneDisabled) {
		this.setState({isPhoneDisabled});
	}

	toggleIsSmsCodeDisabledHandler(isSmsCodeDisabled) {
		this.setState({isSmsCodeDisabled});
	}

	toggleIsAvailableSmsCodeAgainHandler(isAvailableSmsCodeAgain) {
		this.setState({isAvailableSmsCodeAgain});
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

	changeEventAndHidePartnerErrors(event) {
		this.changeEventHandler(event);
		let partner_errors_temp = Object.assign({}, this.props.partner_errors);
		partner_errors_temp.message = undefined;
		this.props.setPartnerErrorsHandler(partner_errors_temp);
	}

	/*
	 * @params {Object} address: dadata response https://dadata.ru/api/clean/#response-address
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

	checkPhoneNumberField(phoneValue) {

		if (!this.props.isPhoneVerified) {
			if (phoneValue.length === 18) { // Ввели номер телефона полностью
				this.toggleIsShowConfirmPhoneHandler(true);
				this.changeEventHandler({
					target: {
						name: 'phone',
						value: phoneValue
					}
				});
			} else {
				this.toggleIsShowConfirmPhoneHandler(false);
				this.changeEventHandler({
					target: {
						name: 'phone',
						value: undefined
					}
				});
			}
		}

		if (this.props.partner_errors && this.props.partner_errors.form_field === 'phone') {
			this.props.checkPhoneVerificationHandler(false);
			this.toggleIsPhoneDisabledHandler(false);
			if (phoneValue.length !== 18) {
				let partner_errors_temp = Object.assign({}, this.props.partner_errors);
				partner_errors_temp.message = undefined;
				this.props.setPartnerErrorsHandler(partner_errors_temp);
			}
		}
	}

	checkSmsCodeField(SmsCode) {
		const {
			fetchSmsCodeHandler,
			setSmsCodeValidHandler,
		} = this.props;

		if (SmsCode.length === 4) { // Ввели смс-код полностью
			fetchSmsCodeHandler(SmsCode);
			this.toggleIsSmsCodeDisabledHandler(true);
			this.changeEventHandler({
				target: {
					name: 'smscode',
					value: SmsCode
				}
			});
		} else {
			this.toggleIsSmsCodeDisabledHandler(false);
			setSmsCodeValidHandler(false);
			this.changeEventHandler({
				target: {
					name: 'smscode',
					value: undefined
				}
			});
		}
	}

	_verifyPhoneHandler() {
		const {data, checkPhoneVerificationHandler} = this.props;

		this.changeEventHandler({
			target: {
				name: 'firstname',
				value: data.firstname || null
			}
		});
		this.changeEventHandler({
			target: {
				name: 'email',
				value: data.email || null
			}
		});
		this.toggleIsAvailableSmsCodeAgainHandler(false);
		if (data.firstname && data.email) {
			checkPhoneVerificationHandler(true, {
				phone: data.phone,
				name: data.firstname,
				email: data.email,
			});
			this.toggleIsPhoneDisabledHandler(true);
			this.toggleIsSmsCodeDisabledHandler(false);
			this.changeEventHandler({
				target: {
					name: 'smscode',
					value: undefined
				}
			});
		}
	}

	getPhoneInputStatus() {
		const {isPhoneVerified} = this.props;
		const {isShowConfirmPhone} = this.state;
		let status;

		if (isPhoneVerified) {
			status = 'valid';
		} else {
			status = isShowConfirmPhone ? 'warning' : ''
		}

		return {type: status};
	}

	render() {
		const {
			data,
			errors,
			partner_errors,
			isSmsCodeInvalid,
			isPhoneVerified,
			checkPhoneVerificationHandler,
			eosagoPage,
		} = this.props;

		const phoneData = data.phone;

		const {
			isShowConfirmPhone,
			isPhoneDisabled
		} = this.state;

		if (phoneData && !isShowConfirmPhone && !isPhoneVerified) {
			this.checkPhoneNumberField(phoneData);
		}

		const today = new Date();
		const timerPeriod = 60000;

		return (
				<div className="grid__row grid__row--v-default">
					<div className="grid__cell grid__cell--12">
						<Field name="Фамилия">
							<InputText
								className={ classNames('input--full-width', {'input--alert': data.lastname !== undefined && errors.lastname}) }
								name="lastname"
								value={ data.lastname }
								onChange={ this.changeEventHandler }
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
								onChange={ this.changeEventAndHidePartnerErrors.bind(this) }
							/>
							<ErrorMessage message={ data.birthday !== undefined && errors.birthday } />
						</Field>
						{partner_errors && partner_errors.form_field === 'birthday' && partner_errors.message &&
						<div className="margin-top-x-small">
							<AlertPanel theme="danger">
								{partner_errors.message}
							</AlertPanel>
						</div>
						}
					</div>
					<div className="grid__cell grid__cell--12">
						<Field name="Паспорт">
							<InputSeriesNumber
								name="passport"
								values={ {series: data.passport_series, number: data.passport_number} }
								onChange={ this.changeEventAndHidePartnerErrors.bind(this) }
								errors={ errors }
								masks={ {series: '99 99', number: '999999'} }
							/>
							<ErrorMessage
								message={ data.passport_series !== undefined && ((data.passport_number !== undefined && errors.passport_number) || errors.passport_series) }
							/>
						</Field>
						{partner_errors && partner_errors.form_field === 'passport_series' && partner_errors.message &&
						<div className="margin-top-x-small">
							<AlertPanel theme="danger">
								{partner_errors.message}
							</AlertPanel>
						</div>
						}
					</div>
					<div className="grid__cell grid__cell--12">
						<Field name="Дата выдачи">
							<InputCalendar name="passport_issue_date"
								value={ data.passport_issue_date }
								error={ data.passport_issue_date !== undefined && errors.passport_issue_date }
								endDate={ {day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear()} }
								onChange={ this.changeEventHandler }
							/>
							<ErrorMessage message={ data.passport_issue_date !== undefined && errors.passport_issue_date } />
						</Field>
					</div>
					<div className="grid__cell grid__cell--12">
						<Field name="Кем выдан">
						<textarea
							className={ classNames('input--full-width', {'input--alert': data.passport_emitent !== undefined && errors.passport_emitent}) }
							name="passport_emitent"
							value={ data.passport_emitent }
							onChange={ this.changeEventHandler }
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
					<div className="grid__cell grid__cell--12">
						<Field name="Электронная почта" hint="На нее будет отправлен полис ОСАГО">
							<Input
								name="email"
								value={ data.email }
								blurHandler={ (value, event) => this.changeEventAndHidePartnerErrors(event) }
								changeHandler={ value => {
									this.changeEventHandler({
										target: {
											name: 'email',
											value: value
										}
									});
								} }
								status={ data.email !== undefined && errors.email && {type: 'error', message: errors.email} }
							/>
							<ErrorMessage message={ data.email !== undefined && errors.email } />
						</Field>
						{partner_errors && partner_errors.form_field === 'email' && partner_errors.message &&
						<div className="margin-top-x-small">
							<AlertPanel theme="danger">
								{partner_errors.message}
							</AlertPanel>
						</div>
						}
					</div>
					<div className="grid__cell grid__cell--12">
						<Field name="Мобильный телефон" hint="Необходим для заключения договора">
							<div className="input-with-icon input-with-icon--full-width">
								<Input
									name="phone"
									value={ data.phone }
									mask={ '+7 (999) 999-99-99' }
									maskChar={ null }
									blurHandler={
										(phoneValue) => {
											this.changeEventHandler({
												target: {
													name: 'phone',
													value: phoneValue
												}
											})
										}
									}
									changeHandler={ this.checkPhoneNumberField }
									status={ this.getPhoneInputStatus() }
									disabled={ isPhoneVerified || this.state.isPhoneDisabled }
									autoComplete="nope"
								/>
								{isPhoneVerified &&
								<Icon name="checkmark" className="input-with-icon__icon color-green" />
								}
								{isShowConfirmPhone && !isPhoneVerified &&
								<Icon name="warning-24" className="input-with-icon__icon color-yellow-dark" />
								}
								{isPhoneVerified === undefined && this.state.isPhoneDisabled && (
									<div className="margin-top-x-small">
										<Loader size="small" />
									</div>
								)}
							</div>
							<ErrorMessage message={ data.phone !== undefined && errors.phone } />
							{this.state.isShowConfirmPhone && !this.state.isPhoneDisabled && (
								<div className="margin-top-xx-small">
									<Button theme="blue"
										size="small"
										clickHandler={ this._verifyPhoneHandler }
									>
										Получить код подтверждения
									</Button>
								</div>
							)}
							{isPhoneVerified === false && this.state.isPhoneDisabled && (
								<div className="margin-top-xx-small">
									<button
										className="text-link"
										onClick={ () => {
											checkPhoneVerificationHandler(false);
											this.toggleIsPhoneDisabledHandler(false);
										} }
									>
										Изменить телефон
									</button>
								</div>
							)}
						</Field>
						{partner_errors && partner_errors.form_field === 'phone' && partner_errors.message &&
						<div className="margin-top-x-small">
							<AlertPanel theme="danger">
								{partner_errors.message}
							</AlertPanel>
						</div>
						}
					</div>
					{isPhoneVerified === false && isPhoneDisabled && (
						<div className="grid__cell grid__cell--12">
							<Field name="SMS-код">
								<div className="input--medium-width">
									<Input
										name="smscode"
										value={ data.smscode }
										mask={ '9999' }
										maskChar={ null }
										blurHandler={
											(SmsCode) => {
												this.changeEventHandler({
													target: {
														name: 'smscode',
														value: SmsCode
													}
												})
											}
										}
										changeHandler={ this.checkSmsCodeField }
										disabled={ this.state.isCodeFilled && isPhoneVerified !== undefined && !isSmsCodeInvalid }
										status={ {type: isSmsCodeInvalid ? 'error' : ''} }
									/>
									{this.state.isCodeFilled && this.state.isPhoneDisabled && !isSmsCodeInvalid && (
										<Loader size="small" />
									)}
								</div>
								<ErrorMessage message={ data.smscode !== undefined && errors.smscode } />
								<ErrorMessage message={ isSmsCodeInvalid && 'Неверный код' } />
								<div className="margin-top-xx-small">
									<button
										className="text-link"
										onClick={ () => {
											if (this.state.isAvailableSmsCodeAgain) {
												checkPhoneVerificationHandler(true, {
													phone: data.phone,
													name: data.firstname,
													email: data.email,
												});
												this.toggleIsPhoneDisabledHandler(true);
												this.toggleIsSmsCodeDisabledHandler(false);
												this.toggleIsAvailableSmsCodeAgainHandler(false);
												this.changeEventHandler({
													target: {
														name: 'smscode',
														value: undefined
													}
												})
											}
										} }
									>
										Получить SMS-код повторно
									</button>
									{!this.state.isAvailableSmsCodeAgain && (
										<span>, через {' '}
											<Timer
												time={ timerPeriod }
												isReversed={ true }
												endHandler={ () => {
													this.toggleIsAvailableSmsCodeAgainHandler(true)
												} }
											/>
									</span>
									)}
								</div>
							</Field>
						</div>
					)}
				</div>
		);
	}
}

export default InsurantForm;
