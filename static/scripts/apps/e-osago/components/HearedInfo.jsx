import React from 'react';
import { OSAGO_PERIODS, TODAY } from '../constants.js';
import { convertTimestampToStr, convertTimestampToObj } from '../utils.js';
import { AlertPanel, Tooltip, Icon } from 'react-ui';
import Calendar from 'ui.calendar';
import { formatLocalDateToString, addLeadingZero } from 'helpers';

export default class HeaderInfo extends React.Component {

	componentDidMount() {
		this.initCalendar(this.props.policyStartDate || null);
	}

	componentWillReceiveProps(nextProps) {
		const { policyStartDate } = nextProps;

		if (policyStartDate && policyStartDate !== this.props.policyStartDate) {
			if (this._calendarInstance) {
				this._calendarInstance.destroy();
			}
			this.initCalendar(policyStartDate);

			let partner_errors_temp = Object.assign({}, this.props.partner_errors);
			partner_errors_temp.message = undefined;
			this.props.setPartnerErrorsHandler(partner_errors_temp);
		}
	}

	componentWillUnmount() {
		if (this._calendarInstance) {
			this._calendarInstance.destroy();
			this._calendarInstance = null;
		}
	}

	initCalendar(policyStartDate) {
		const selectedDate = convertTimestampToObj(new Date(policyStartDate).valueOf());
		const { changeHandler, isMobile } = this.props;

		const startDate = new Date();
		startDate.setDate(startDate.getDate() + 4);

		this._calendarInstance = new Calendar({
			$toggler: $(`${ !isMobile ? '[data-click="open-calendar"]' : '' }`),
			startDate: {
				day: startDate.getDate(),
				month: startDate.getMonth() + 1,
				year: startDate.getFullYear()
			},
			selectedDate,
			endDate: {
				day: TODAY.getDate(),
				month: TODAY.getMonth() + 5,
				year: TODAY.getFullYear()
			},
			onSelect: (date) => {
				const polycyStartDate = formatLocalDateToString(date.year, date.month, date.day);
				changeHandler('osago_policy_start_date', polycyStartDate);
			}
		});
		this._calendarInstance.setDate(selectedDate);
	}

	render() {
		const { period, policyStartDate, policyStartDateMessage, partner_errors, isMobile } = this.props;
		const policyStartDateStr = convertTimestampToStr(new Date(policyStartDate).valueOf())
			.split('-')
			.reverse()
			.map((item) => addLeadingZero(item))
			.join('.');

		const policyStartDateLink = (
			<span className={ !isMobile ? 'link-with-icon' : 'margin-top-anti' } data-click={ !isMobile ? 'open-calendar' : '' }>
				<span className={ `${!isMobile ? 'pseudo-link' : ''}` }> { policyStartDateStr }</span>
				{ !isMobile &&
					<Icon name="pencil" color="gray-blue" size="small" className="margin-left-xx-small" />
				}
			</span>
		);
		const headerDateTooltip = (<span className="pseudo-link">
				Подробнее
			</span>);
		return (
			<div>
				<div className="font-size-medium">
					{ `Период страхования: ${ OSAGO_PERIODS[period] }` }
				</div>
				<div className="font-size-medium grid-hor-inline grid-hor-inline--gap_small" style={ {alignItems: 'center'} }>
					<span>Начало действия: { policyStartDateLink }</span>
					{ policyStartDateMessage &&
						<div className="grid-hor-inline grid-hor-inline--gap_small">
							<span className="icon-attention-24 alert-icon color-orange" />
							<span>Дата была изменена.</span>
							<Tooltip
								header={ headerDateTooltip }
								children="В соответствии с Указанием ЦБ РФ № 4723-У начало срока действия е-ОСАГО наступает не ранее, чем через три дня после отправки данных в страховую компанию."
								placement="bottom"
							/>
						</div>
					}
				</div>
				{ partner_errors && partner_errors.form_field === 'policy_start_date' && partner_errors.message &&
					<div className="margin-top-x-small">
						<AlertPanel theme="danger">
							{ partner_errors.message }
						</AlertPanel>
					</div>
				}
			</div>
		)
	}
}
