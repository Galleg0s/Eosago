import React from 'react';
import FormStore from '../../../stores/form-store.js';
import InputCalendar from '../../../../e-osago/elements/InputCalendar.jsx';
import DateHelpers from '../../../../../_common/utils/date-helpers.js';
import { formatLocalDateToString } from 'helpers';

class IssueDateField extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		const issueDateRanges = FormStore.getCalendarRanges('issue_date');
		this.state = {
			issueStartDate: this._getIssueStartDate(this.props.dependencies.birthday),
			issueEndDate: issueDateRanges.to
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			issueStartDate: this._getIssueStartDate(nextProps.dependencies.birthday)
		});
	}
	_getIssueStartDate(value) {
		const issueDateRanges = FormStore.getCalendarRanges('issue_date');
		const bDate = new Date(value);
		bDate.setFullYear(bDate.getFullYear() + 16);
		return value && bDate.valueOf() <= new Date(issueDateRanges.to.year, issueDateRanges.to.month - 1, issueDateRanges.to.day).valueOf() ?
			DateHelpers.convertStringToDateObject(bDate) : issueDateRanges.from;
	}
	onChange({ target: { value } }) {
		const birthDate = new Date(value);
		this.props.onChange.bind(this, 'issue_date')(formatLocalDateToString(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate()));
	}
	render() {
		const { issueStartDate, issueEndDate } = this.state;
		const { value } = this.props;
		const valueDate = new Date(value).valueOf();
		const isValid = valueDate >= new Date(issueStartDate.year, issueStartDate.month - 1, issueStartDate.day).valueOf() &&
			valueDate <= new Date(issueEndDate.year, issueEndDate.month - 1, issueEndDate.day).valueOf();
		return (
			<InputCalendar
				startDate={ issueStartDate }
				endDate={ issueEndDate }
				value={ value }
				error={ !isValid }
				onChange={ this.onChange }
			/>
		)
	}
}

module.exports = IssueDateField;
