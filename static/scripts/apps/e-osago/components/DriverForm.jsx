import React from 'react';
import classNames from 'classnames';

import { AlertPanel } from 'react-ui';
import Field from '../layout/Field.jsx';
import InputText from '../elements/InputText.jsx';
import InputCalendar from '../elements/InputCalendar.jsx';
import ErrorMessage from '../elements/ErrorMessage.jsx';
import InputSeriesNumber from '../elements/InputSeriesNumber.jsx';
import { scrollToField } from '../utils.js';

function DriverForm(props) {
	const {
		data,
		errors,
		partner_errors,
		changeHandler,
		setPartnerErrorsHandler
	} = props;

	const today = new Date();

	if (partner_errors && partner_errors.message) {
		if (partner_errors.form_field === 'date_experience') {
			const elemScroll = document.querySelector('[name=date_experience]');
			elemScroll && scrollToField(elemScroll);
		}
	}

	function changeEventHandler(event) {
		let target = event.target;
		let type = target.type;
		let name = target.name || 'unnamed';
		let valueProp = type === 'checkbox' ? 'checked' : 'value';
		let value = target[valueProp];

		changeHandler(name, value);
	}

	function changeEventAndHidePartnerErrors(event) {
		changeEventHandler(event);
		let partner_errors_temp = Object.assign({}, partner_errors);
		partner_errors_temp.message = undefined;
		setPartnerErrorsHandler(partner_errors_temp);
	}

	let issueDateStart = {
		day: data.birthday ? new Date(data.birthday).getDate() : today.getDate(),
		month: data.birthday ? new Date(data.birthday).getMonth() + 1 : today.getMonth() + 1,
		year: data.birthday ? new Date(data.birthday).getFullYear() + 16 : today.getFullYear()
	};

	let dates = {
		birthday: {
			end: {
				day: today.getDate(),
				month: today.getMonth() + 1,
				year: today.getFullYear() - 18
			},
			selected: {
				day: today.getDate(),
				month: today.getMonth() + 1,
				year: today.getFullYear() - 18
			}
		},
		experience: {
			start: issueDateStart,
			selected: {
				day: today.getDate(),
				month: today.getMonth() + 1,
				year: today.getFullYear()
			},
			end: {
				day: today.getDate(),
				month: today.getMonth() + 1,
				year: today.getFullYear()
			}
		}
	};

	return (
		<form>
			<div className="grid__row grid__row--v-default">
				<div className="grid__cell grid__cell--12">
					<Field name="Фамилия">
						<InputText
							className={ classNames('input--full-width', {'input--alert': data.lastname !== undefined && errors.lastname}) }
							name="lastname"
							value={ data.lastname }
							onChange={ changeEventHandler }
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
							onChange={ changeEventHandler }
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
							onChange={ changeEventHandler }
						/>
						<ErrorMessage message={ data.patronymic !== undefined && errors.patronymic } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Пол" noMargin>
						<label className="margin-right-default">
							<input
								className="modern-radio-button"
								type="radio"
								name="gender"
								value="m"
								checked={ data.gender == 'm' }
								onChange={ changeEventHandler }
							/>
							<span className="radio-button-label">Мужской</span>
						</label>
						<label>
							<input
								className="modern-radio-button"
								type="radio"
								name="gender"
								value="f"
								checked={ data.gender == 'f' }
								onChange={ changeEventHandler }
							/>
							<span className="radio-button-label">Женский</span>
						</label>
						<ErrorMessage message={ Object.keys(errors).length == 1 && errors.gender } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Дата рождения">
						<InputCalendar
							name="birthday"
							value={ data.birthday }
							error={ data.birthday !== undefined && errors.birthday }
							selectedDate={ dates.birthday.selected }
							startDate={ {day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() - 90} }
							endDate={ dates.birthday.end }
							onChange={ changeEventHandler }
						/>
						<ErrorMessage message={ data.birthday !== undefined && errors.birthday } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Права">
						<InputSeriesNumber
							name="license"
							values={ {series: data.license_series, number: data.license_number} }
							errors={ errors }
							masks={ {series: '99**', number: '999999'} }
							onChange={ changeEventHandler }
						/>
						<ErrorMessage message={ data.license_series !== undefined && ((data.license_number !== undefined && errors.license_number) || errors.license_series) } />
					</Field>
				</div>
				<div className="grid__cell grid__cell--12">
					<Field name="Дата выдачи первых прав" tooltip="Если вы не помните день и месяц, то укажите: 1 июля года получения прав">
						<InputCalendar
							name="date_experience"
							value={ data.date_experience }
							startDate={ dates.experience.start }
							selectedDate={ dates.experience.selected }
							endDate={ dates.experience.end }
							onChange={ changeEventAndHidePartnerErrors }
						/>
						<ErrorMessage message={ data.date_experience !== undefined && errors.date_experience } />
					</Field>
					{ partner_errors && partner_errors.form_field === 'date_experience' && partner_errors.message &&
						<div className="margin-top-x-small">
							<AlertPanel theme="danger">
								{ partner_errors.message }
							</AlertPanel>
						</div>
					}
				</div>
			</div>
		</form>
	);
}

export default DriverForm;
