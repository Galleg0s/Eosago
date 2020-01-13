import React, { Component } from 'react';
import T from 'prop-types';
import { Field } from 'redux-form';
import cx from 'classnames';
import UICalendar from 'ui.calendar';
import { Flex, Icon, InputMask } from 'react-ui';
import fieldWrapper from '../FieldWrapper/FieldWrapper';

function dateMask(rawInput) {
	// TODO: Change mask depending on input data
	return [/[0-3]/, /\d/, '.', /[0-1]/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
}

class DateRangeField extends Component {
	static propTypes = {
		label: T.string,
		input: T.shape().isRequired,
		meta: T.shape().isRequired,
	};

	static defaultProps = {
		label: null,
	};

	componentDidMount() {
		const now = new Date();
		const startDate = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
		const endDate = { ...startDate, year: now.getFullYear() + 1};
		this.startDateCalendar = new UICalendar({
			$toggler: this.startDateToggle,
			startDate,
			endDate,
			onSelect: (date) => this.onDateSelect('startDate', date),
		});
		this.endDateCalendar = new UICalendar({
			$toggler: this.endDateToggle,
			startDate,
			endDate,
			onSelect: (date) => this.onDateSelect('endDate', date),
		});
	}

	componentWillUnmount() {
		if (this.startDateCalendar && this.endDateCalendar) {
			this.startDateCalendar.destroy();
			this.endDateCalendar.destroy();
		}
	}

	onStartDateChange = value => {
		const { input } = this.props;
		if (!value) {
			input.onChange({ ...input.value, startDate: null });
			return;
		}
		if (this.startDateCalendar) {
			const [day, month, year] = value.split('.');
			if (year && year.length === 4) {
				input.onChange({ ...input.value, startDate: value });
				this.startDateCalendar.setDate({ day, month, year });
			}
		}
	};

	onEndDateChange = value => {
		const { input } = this.props;
		if (!value) {
			input.onChange({ ...input.value, endDate: null });
			return;
		}
		if (this.startDateCalendar) {
			const [day, month, year] = value.split('.');
			if (year && year.length === 4) {
				input.onChange({ ...input.value, endDate: value });
				this.startDateCalendar.setDate({ day, month, year });
			}
		}
	};

	onDateSelect = (key, date) => {
		const { input } = this.props;
		// Format single-digit to double-digit
		const day = ('0' + date.day).slice(-2);
		const month = ('0' + (date.month)).slice(-2);
		const value = [day, month, date.year].join('.');
		input.onChange({ ...input.value, [key]: value });
	};

	render() {
		const { input } = this.props;
		return (
			<Flex gap="xsmall">
				<div className="input-with-icon input-with-icon--active">
					<InputMask
						className="form-input-field"
						placeholder="Туда"
						mask={ dateMask }
						type="text"
						value={ input.value.startDate }
						changeHandler={ this.onStartDateChange }
						showMask={ false }
						maskChar={ null }
						guide={ false }
					/>
					<div className="input-with-icon__icon" ref={ (c) => { this.startDateToggle = c; } }>
						<Icon name="calendar" />
					</div>
				</div>
				<div className="input-with-icon input-with-icon--active">
					<InputMask
						className="form-input-field"
						placeholder="Обратно"
						mask={ dateMask }
						type="text"
						value={ input.value.endDate }
						changeHandler={ this.onEndDateChange }
						showMask={ false }
						maskChar={ null }
						guide={ false }
					/>
					<div className="input-with-icon__icon" ref={ (c) => { this.endDateToggle = c; } }>
						<Icon name="calendar" />
					</div>
				</div>
			</Flex>
		);
	}
}

export default fieldWrapper(DateRangeField);
