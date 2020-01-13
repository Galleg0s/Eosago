import React from 'react';
import AppDispatcher from '../../../dispatcher/dispatcher.js';
import FormStore from '../../../stores/form-store.js';
import ValidationStore from '../../../stores/validation-store.js';
import InputCalendar from '../../../../e-osago/elements/InputCalendar.jsx';
import { formatLocalDateToString } from 'helpers';

class CarUsedSince extends React.Component {
	constructor(props) {
		super(props);
		const dateRanges = FormStore.getCalendarRanges('car_used_since');
		this.state = {
			startDate: dateRanges.from,
			endDate: dateRanges.to,
			fieldName: FormStore.getFieldName('car_used_since')
		}
	}
	componentWillReceiveProps(nextProps) {
		const newStartDate = {
			year: parseInt(nextProps.data.car[2].value),
			month: 1,
			day: 1
		};

		this.setState({
			startDate: newStartDate
		});
	}
	_onChange(e) {
		const date = new Date(e.target.value);
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'car_used_since',
			data: formatLocalDateToString(date.getFullYear(), date.getMonth() + 1, date.getDate())
		});
	}
	render() {
		ValidationStore.setField(['car_used_since']);
		const isValid = ValidationStore.validateField(this.props.data, 'car_used_since');

		return (
			<div className="grid__row grid__row--align-center" data-hint="car_used_since">
				<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">{ this.state.fieldName }</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-8">
					<InputCalendar
						name="auto_car_used_since"
						startDate={ this.state.startDate }
						endDate={ this.state.endDate }
						value={ this.props.data.car_used_since }
						error={ !isValid }
						onChange={ this._onChange }
					/>
				</div>
			</div>
		);
	}
}

module.exports = CarUsedSince;
