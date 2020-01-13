import React from 'react';
import FormStore from '../../../stores/form-store.js';
import InputCalendar from '../../../../e-osago/elements/InputCalendar.jsx';
import { formatLocalDateToString } from 'helpers';

class BirthdayField extends React.Component {
	constructor(props) {
		super(props)
		this.onChange = this.onChange.bind(this);
		const birthdayDateRanges = FormStore.getCalendarRanges('birthday');
		this.state = {
			birthdayStartDate: birthdayDateRanges.from,
			birthdayEndDate: birthdayDateRanges.to
		}
	}

	onChange({ target: { value } }) {
		const birthDate = new Date(value);
		this.props.onChange.bind(this, 'birthday')(formatLocalDateToString(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate()));
	}
	render() {
		const { birthdayStartDate, birthdayEndDate } = this.state;
		const { value } = this.props;
		const valueDate = new Date(value).valueOf();
		const isValid = valueDate >= new Date(birthdayStartDate.year, birthdayStartDate.month - 1, birthdayStartDate.day).valueOf() &&
			valueDate <= new Date(birthdayEndDate.year, birthdayEndDate.month - 1, birthdayEndDate.day).valueOf();
		return (
			<InputCalendar
				startDate={ birthdayStartDate }
				endDate={ birthdayEndDate }
				value={ value }
				error={ !isValid }
				onChange={ this.onChange }
			/>
		)
	}
}

module.exports = BirthdayField;
