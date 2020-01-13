import React from 'react';
import {WrappedFieldProps} from 'redux-form';
import {FormField, InputCalendar} from 'react-ui-2018';
import moment, {Moment} from 'moment';
import {DATE_ISO_FORMAT} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {getValidationStatus} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';

moment.locale('ru');

export interface CalendarProps {
	label: string,
	minDate: Date,
	maxDate: Date,
}

const Calendar = ({label, minDate, maxDate, input: {value, onChange, onBlur, ...otherInputProps}, meta}: CalendarProps & WrappedFieldProps) => {
	const handleChange = (value: Moment) => {
		const dateString = value.format(DATE_ISO_FORMAT);
		onChange(dateString);
	};

	return (
		<FormField
			size="medium"
			label={ label }
			component={ InputCalendar }
			minDate={ minDate && moment(minDate).format(DATE_ISO_FORMAT) }
			maxDate={ maxDate && moment(maxDate).format(DATE_ISO_FORMAT) }
			value={ value && moment(value, DATE_ISO_FORMAT) }
			onChange={ handleChange }
			status={ getValidationStatus(meta) }
			{ ...otherInputProps }
		/>
	)
};

export default Calendar;
