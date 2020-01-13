import React from 'react';
import {Field, FormSection, InjectedFormProps, reduxForm} from 'redux-form';
import {FlexboxGrid} from '../../../../../../../../../../node_modules/react-ui-2018';
import {
	FormValues, PassportFieldNames,
	PersonType
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	FORM_INITIAL_VALUES,
	FORM_TITLES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import Input, {InputType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Input';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import NavigationButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import validate from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Passport/validate';

interface PassportProps {
	type: PersonType,
	onPrevClick: Function,
	isMobile: boolean,
}

const Passport: React.FC<PassportProps & InjectedFormProps<FormValues, PassportProps>> = (props) => {
	const direction = props.isMobile ? 'vert' : 'row';
	const gridGap = props.isMobile ? 'small' : 'default';
	return (
		<form>
			<FormSection name={ `${props.type}.passport` }>
				{/* eslint-disable-next-line react/jsx-no-undef */}
				<FlexboxGrid gap={ gridGap } direction="vert">
					<Title>Паспортные данные { FORM_TITLES[props.type].passport }</Title>
					<FlexboxGrid gap={ gridGap } direction={ direction } equalWidth>
						<Field
							name={ PassportFieldNames.seriesNumber }
							component={ Input }
							label="Паспорт"
							placeholder="Серия и номер"
							type={ InputType.tel }
							mask="99 99 999999"
						/>
						<Field
							name={ PassportFieldNames.emitentCode }
							component={ Input }
							label="Код подразделения"
							mask="999-999"
							type={ InputType.tel }
						/>
					</FlexboxGrid>
					<Field
						name={ PassportFieldNames.emitent }
						component={ Input }
						label="Кем выдан"
					/>
					<Field
						name={ PassportFieldNames.issueDate }
						component={ Input }
						label="Дата выдачи"
						mask="99.99.9999"
						type={ InputType.tel }
						placeholder="дд.мм.гггг"
					/>
					<NavigationButtons
						isMobile={ props.isMobile }
						handleSubmit={ props.handleSubmit }
						onPrevClick={ props.onPrevClick }
						isNextDisabled={ props.invalid }
					/>
				</FlexboxGrid>
			</FormSection>
		</form>
	)
};

export default reduxForm<FormValues, PassportProps>({
	form: OSAGO_FORM_NAME,
	initialValues: FORM_INITIAL_VALUES,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate,
})(Passport);
