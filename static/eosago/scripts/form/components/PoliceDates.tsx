import React from 'react';
import {Field, InjectedFormProps, reduxForm} from 'redux-form';
import {FlexboxGrid, Text} from 'react-ui-2018';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import Selector from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Selector';
import Calendar from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Calendar';
import {
	FORM_INITIAL_VALUES,
	OSAGO_FORM_NAME,
	tomorrow
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import NavigationButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import {FormValues} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

interface PoliceDatesProps {
	onPrevClick: Function,
	isMobile: boolean,
}

export interface PeriodItem {
	id: number,
	name: string,
}

const PERIODS: PeriodItem[] = [
	{id: 1, name: '3 месяца'},
	{id: 2, name: '4 месяца'},
	{id: 3, name: '5 месяцев'},
	{id: 4, name: '6 месяцев'},
	{id: 5, name: '7 месяцев'},
	{id: 6, name: '8 месяцев'},
	{id: 7, name: '9 месяцев'},
	{id: 8, name: '12 месяцев'}
];

const PoliceDates: React.FC<PoliceDatesProps & InjectedFormProps<FormValues, PoliceDatesProps>> = (props) => {
	const direction = props.isMobile ? 'vert' : 'row-reverse';
	const gridGap = props.isMobile ? 'small' : 'default';
	return (
		<form>
			<FlexboxGrid gap={ gridGap } direction="vert">
				<Title>Укажите дату начала действия полиса</Title>
				<FlexboxGrid gap={ gridGap } direction={ direction } equalWidth>
					<Field
						name="period"
						component={ Selector }
						label="Период использования"
						data={ PERIODS }
					/>
					<Field
						name="dateStart"
						component={ Calendar }
						label="Начало действия"
						minDate={ tomorrow }
					/>
				</FlexboxGrid>
				<Text
					color="minor-black-lighten"
					size="7"
				>
					Для получения положительного решения от страховых компаний, указывайте дату не ранее трех дней от текущей
				</Text>
				<NavigationButtons isMobile={ props.isMobile } handleSubmit={ props.handleSubmit } onPrevClick={ props.onPrevClick } />
			</FlexboxGrid>
		</form>
	)
};

export default reduxForm<FormValues, PoliceDatesProps>({
	form: OSAGO_FORM_NAME,
	initialValues: FORM_INITIAL_VALUES,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
})(PoliceDates);
