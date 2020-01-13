import React from 'react';
import AppDispatcher from '../../../dispatcher/dispatcher.js';
import FormStore from '../../../stores/form-store.js';
import ValidationStore from '../../../stores/validation-store.js';
import InputCalendar from '../../../../e-osago/elements/InputCalendar.jsx';
import { formatLocalDateToString } from 'helpers';
import { Icon } from 'react-ui';

class PolicyStartDate extends React.Component {
	constructor(props) {
		super(props);
		const dateRanges = FormStore.getCalendarRanges('policy_start_date');
		this.state = {
			startDate: dateRanges.from,
			endDate: dateRanges.to,
			fieldName: FormStore.getFieldName('policy_start_date')
		}
	}

	_getFieldName(insuranceTypes) {
		let fieldName = 'Начало действия полиса ';

		if (insuranceTypes.kasko !== insuranceTypes.osago) {
			if (insuranceTypes.kasko) {
				fieldName += 'Каско';
			} else {
				fieldName += 'ОСАГО';
			}
		} else {
			fieldName = this.state.fieldName;
		}

		return fieldName;
	}
	_onChange(e) {
		const date = new Date(e.target.value);
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'policy_start_date',
			data: formatLocalDateToString(date.getFullYear(), date.getMonth() + 1, date.getDate())
		});

		dataLayer.push({ event: 'GTM_event',
			eventCategory: 'INS_Calculator',
			eventAction: 'auto_policy_date_selected'
		});
	}
	render() {
		ValidationStore.setField(['policy_start_date']);
		const isValid = ValidationStore.validateField(this.props.data, 'policy_start_date');

		return (
			<div className="grid__row grid__row--align-center" data-hint="policy_start_date">
				<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">{ this._getFieldName(this.props.data.type) }</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-8">
					{ !this.props.data.type.kasko ? (
						<div className="flexbox flexbox-inline flexbox--row flexbox--gap_small flexbox--align-items_center">
							<InputCalendar
								name="auto_policy_start_date"
								startDate={ this.state.startDate }
								endDate={ this.state.endDate }
								value={ this.props.data.policy_start_date }
								error={ !isValid }
								onChange={ this._onChange }
							/>
							<Icon
								name="attention-24"
								size="medium"
								color="orange"
							/>
							<span className="font-size-default">Дата начала действия е-ОСАГО может быть не ранее чем через 3 дня от текущей даты.</span>
						</div>
					) : (
						<InputCalendar
							name="auto_policy_start_date"
							startDate={ this.state.startDate }
							endDate={ this.state.endDate }
							value={ this.props.data.policy_start_date }
							error={ !isValid }
							onChange={ this._onChange }
						/>
					)}
				</div>
			</div>
		);
	}
}

module.exports = PolicyStartDate;
