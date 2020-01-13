import React from 'react';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { FlexboxGrid } from 'react-ui-2018';
import Title from '../../elements/Title';
import Input, { InputType } from '../../elements/Input';
import NavigationButtons from '../../elements/NavButtons';
import {
	DiagnosticCardFieldNames,
	FormValues
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	FORM_INITIAL_VALUES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import validate from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/DiagnosticCard/validate';


interface DiagnosticCardProps {
	onPrevClick: Function,
	isMobile: boolean,
}

const DiagnosticCard: React.FC<DiagnosticCardProps & InjectedFormProps<FormValues, DiagnosticCardProps>> = ({handleSubmit, onPrevClick, invalid, isMobile}) => {
	const gridGap = isMobile ? 'small' : 'default';
	const direction = isMobile ? 'vert' : 'row';
	return (
		<form>
			<FlexboxGrid gap={ gridGap } direction="vert">
				<Title>Диагностическая карта</Title>
				<FlexboxGrid gap={ gridGap } direction={ direction } equalWidth>
					<Field
						name={ DiagnosticCardFieldNames.number }
						component={ Input }
						label="Номер"
						mask="999999999999999999999"
						type={ InputType.tel }
					/>
					<Field
						name={ DiagnosticCardFieldNames.expirationDate }
						component={ Input }
						label="Действует до"
						mask="99.99.9999"
						placeholder="дд.мм.гггг"
						type={ InputType.tel }
					/>
				</FlexboxGrid>
				<NavigationButtons
					isMobile={ isMobile }
					handleSubmit={ handleSubmit }
					onPrevClick={ onPrevClick }
					isNextDisabled={ invalid }
				/>
			</FlexboxGrid>
		</form>
	)
};

export default reduxForm<FormValues, DiagnosticCardProps>({
	form: OSAGO_FORM_NAME,
	initialValues: FORM_INITIAL_VALUES,
	validate,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
})(DiagnosticCard);
