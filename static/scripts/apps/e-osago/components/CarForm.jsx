import React, { Fragment } from 'react';
import classNames from 'classnames';

import Field from '../layout/Field.jsx';
import InputCalendar from '../elements/InputCalendar.jsx';
import ErrorMessage from '../elements/ErrorMessage.jsx';
import MaskedInput from '../elements/MaskedInput.jsx';
import { AlertPanel, ButtonGroup, Icon, Flex, TogglerDropdownSelect, field } from 'react-ui';
import { CAR_IDENTIFIERS } from '../constants';
import { scrollToField } from '../utils.js';

const TogglerDropdownSelectField = field(TogglerDropdownSelect);

function CarForm(props) {
	const { data, errors, partner_errors, setPartnerErrorsHandler, changeHandler } = props;

	const today = new Date();
	const carPassportMinDate = new Date(data.year, 0, 1);

	if (partner_errors && partner_errors.message) {
		if (partner_errors.form_field === 'diagnostic_card') {
			const elemScroll = document.querySelector('[name=diagnostic_card]');
			elemScroll && scrollToField(elemScroll);
		}
	}

	const passportTypes = [
		{
			id: 'STS',
			children: <span> СТС</span>,
			name: 'registration_passport_type',
			value: 'STS',
			type: 'text',
			active: data.registration_passport_type !== 'PTS'
		},
		{
			id: 'PTS',
			children: <span> ПТС</span>,
			name: 'registration_passport_type',
			value: 'PTS',
			type: 'text',
			active: data.registration_passport_type === 'PTS'
		},
	];

	function changeEventHandler(event) {
		let target = event.target;
		let type = target ? target.type : event.type;
		let name = target ? target.name || 'unnamed' : event.name || 'unnamed';
		let valueProp = type === 'checkbox' ? 'checked' : 'value';
		let value = target ? target[valueProp] : event[valueProp];

		// Leonid: Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.)
		changeHandler(name, value === void 0 ? null : value);
	}

	function changeEventAndHidePartnerErrors(event) {
		changeEventHandler(event);
		let partner_errors_temp = Object.assign({}, partner_errors);
		partner_errors_temp.message = undefined;
		setPartnerErrorsHandler(partner_errors_temp);
	}

	function changeIdentifierHandler({id}) {
		if (id !== 'vin') {
			changeEventHandler({target: {name: 'vin', value: void 0}});
		}
		if (id !== 'body_number') {
			changeEventHandler({target: {name: 'body_number', value: void 0}});
		}
		changeEventHandler({target: {name: 'identifier', value: id}});
	}

	const needDiagnosticCard = Number(data.year) + 3 <= today.getFullYear();

	return (
		<div className="grid__row grid__row--v-default">
			<div className="grid__cell grid__cell--12">
				<div className="font-size-large margin-bottom-x-small color-gray-gray">
					{ `${data.brand} ${data.model}, ${data.modification}, ${data.year}` }
				</div>
			</div>
			<div className="grid__cell grid__cell--12">
				<Field name="СТС или ПТС" hint="Укажите серию и номер одного из документов">
					<div className="flexbox flexbox--vert flexbox--gap_xsmall">
						<div className="flexbox__item">
							<ButtonGroup
								changeHandler={ changeEventHandler }
								items={ passportTypes }
							/>
						</div>
						<div className="flexbox__item">
							<MaskedInput
								className={ classNames('input--medium-width', {'input--alert': data.registration_passport !== void 0 && errors.registration_passport}) }
								type="text"
								name="registration_passport"
								value={ data.registration_passport }
								mask="99 pp 999999"
								casing="upper"
								onChange={ changeEventHandler }
								placeholder="00 ЯЯ 000000"
							/>
						</div>
					</div>
					<ErrorMessage message={ data.registration_passport !== void 0 && errors.registration_passport } />
				</Field>
			</div>
			<div className="grid__cell grid__cell--12">
				<Field name="Мощность двигателя, л.с." hint="Указана в ПТС">
					<MaskedInput
						className={ classNames('input--medium-width', {'input--alert': data.power !== void 0 && errors.power}) }
						type="text"
						name="power"
						value={ data.power }
						mask="9{1,4}[.99]"
						onChange={ changeEventHandler }
					/>
					<ErrorMessage message={ data.power !== void 0 && errors.power } />
				</Field>
			</div>
			<div className="grid__cell grid__cell--12">
				<Field name="Дата выдачи документа">
					<InputCalendar
						name="registration_passport_date"
						value={ data.registration_passport_date }
						error={ data.registration_passport_date !== void 0 && errors.registration_passport_date }
						startDate={ { day: carPassportMinDate.getDate(), month: carPassportMinDate.getMonth() + 1, year: carPassportMinDate.getFullYear() } }
						selectedDate={ { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() } }
						endDate={ { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() } }
						onChange={ changeEventHandler }
					/>
					<ErrorMessage message={ data.registration_passport_date !== void 0 && errors.registration_passport_date } />
				</Field>
			</div>
			<div className="grid__cell grid__cell--12">
				<Field name="Гос. номер авто (если есть)" hint="Указан в ПТС, буквы русские">
					<MaskedInput
						className={ classNames('input--medium-width',
							{'input--alert': data.license_plate !== void 0 && data.license_plate !== '' && errors.license_plate}) }
						type="text"
						name="license_plate"
						value={ data.license_plate }
						mask="g999gg 99[9]"
						placeholder="A000AA 00"
						casing="upper"
						onChange={ changeEventHandler }
					/>
					<ErrorMessage message={ data.license_plate !== void 0 && data.license_plate !== '' && errors.license_plate } />
				</Field>
			</div>
			<div className="grid__cell grid__cell--12">
				<Field name="Идентификатор авто">
					<TogglerDropdownSelectField
						items={ CAR_IDENTIFIERS }
						changeHandler={ changeIdentifierHandler }
						selectedId={ data.identifier }
					/>
					{ data.identifier === 'vin' &&
						<div>
							<MaskedInput
								className={ classNames('input--full-width', {'input--alert': data.vin !== null && errors.vin}) }
								type="text"
								name="vin"
								value={ data.vin === null ? void 0 : data.vin }
								mask="v{17}"
								casing="upper"
								onChange={ changeEventHandler }
								placeholder="XXXX XXXX XXXX XXXX X"
							/>
							<div className="color-gray-gray margin-top-xx-small">
								VIN-номер (17 символов) указан в ПТС
							</div>
							<ErrorMessage message={ data.vin !== null && errors.vin } />
						</div>
					}
					{ data.identifier === 'body_number' &&
						<div>
							<MaskedInput
								className={ classNames('input--full-width',
									{'input--alert': data.body_number !== null && errors.body_number}) }
								type="text"
								name="body_number"
								value={ data.body_number === null ? void 0 : data.body_number }
								mask="b{8}[bbbbbbbbbbbbb]"
								casing="upper"
								onChange={ changeEventHandler }
								placeholder="XXXXX XXXXX XXXXX XXXXX X"
							/>
							<ErrorMessage message={ data.body_number !== null && errors.body_number } />
						</div>
					}
				</Field>
			</div>
			{ needDiagnosticCard && (
				<Fragment>
					<div className="grid__cell grid__cell--12">
						<Field name="Номер диагностической карты" hint="Необязательно к заполнению">
							<MaskedInput
								className={ classNames('input--full-width', {'input--alert': data.diagnostic_card !== void 0 && data.diagnostic_card !== '' && errors.diagnostic_card}) }
								type="text"
								name="diagnostic_card"
								value={ data.diagnostic_card }
								mask="(9{15})|(9{21})"
								placeholder="15 или 21 цифра подряд"
								onChange={ changeEventAndHidePartnerErrors }
							/>
							<ErrorMessage message={ data.diagnostic_card !== void 0 && data.diagnostic_card !== '' && errors.diagnostic_card } />
						</Field>
						{ partner_errors && partner_errors.form_field === 'diagnostic_card' && partner_errors.message &&
						<div className="margin-top-x-small">
							<AlertPanel theme="danger">
								{partner_errors.message}
							</AlertPanel>
						</div>
						}
					</div>
					<div className="grid__cell grid__cell--12">
						<Field name="Срок действия карты" hint="Необязательно к заполнению">
							<InputCalendar
								name="diagnostic_card_date_end"
								value={ data.diagnostic_card_date_end }
								error={ data.diagnostic_card_date_end !== void 0 && errors.diagnostic_card_date_end }
								startDate={ { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() } }
								selectedDate={ { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() } }
								endDate={ { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() + 5 } }
								onChange={ changeEventHandler }
							/>
							<ErrorMessage message={ data.diagnostic_card_date_end !== void 0 && errors.diagnostic_card_date_end } />
						</Field>
					</div>
				</Fragment>
			)}
			<div className="grid__cell grid_cell--12">
				<Field name="Условия использования">
					<label className="display-block margin-top-x-small">
						<input type="checkbox"
							className="modern-checkbox"
							name="has_trailer"
							checked={ data.has_trailer }
							onChange={ changeEventHandler }
						/>
						<span className="checkbox-label">с прицепом</span>
					</label>
					<ErrorMessage message={ data.has_trailer !== void 0 && errors.has_trailer } />
					<label className="display-block margin-top-small">
						<input type="checkbox"
							className="modern-checkbox"
							name="used_as_taxi"
							checked={ data.used_as_taxi }
							onChange={ changeEventHandler }
						/>
						<span className="checkbox-label">такси</span>
					</label>
					<ErrorMessage message={ data.used_as_taxi !== void 0 && errors.used_as_taxi } />
				</Field>
			</div>
		</div>
	);
}

export default CarForm;
