import React from 'react';
import {Field, InjectedFormProps, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {FlexboxGrid} from 'react-ui-2018';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import Input, {InputType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Input';
import NavigationButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import {
	FORM_INITIAL_VALUES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import validate
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/AutoDocuments/validate';
import {
	AutoDocumentsFiledNames, AutoIdentifierFieldNames,
	FormValues,
	State
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {selector} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form';

interface AutoDocumentsProps {
	onPrevClick: Function,
	licensePlate: string,
	isMobile: boolean,
}

const AutoDocuments: React.FC<AutoDocumentsProps & InjectedFormProps<FormValues, AutoDocumentsProps>> = (props) => {
	const gridGap = props.isMobile ? 'small' : 'default';
	const direction = props.isMobile ? 'vert' : 'row';
	return (
		<form>
			<FlexboxGrid gap={ gridGap } direction="vert">
				<Title>
					Свидетельство о регистрации { !props.licensePlate ? 'ПТС' : 'СТС' }
				</Title>
				<FlexboxGrid gap={ gridGap } direction={ direction } equalWidth>
					<Field
						label="Серия и номер"
						normalize={ (value: string) => value.toUpperCase() }
						name={ AutoDocumentsFiledNames.seriesNumber }
						mask="99 xx 999999"
						additionalFormatChars={ {
							x: '[0-9а-яА-Я]'
						} }
						component={ Input }
						useRawInputValue={ true }
					/>
					<Field
						name={ AutoDocumentsFiledNames.issueDate }
						label="Дата выдачи"
						component={ Input }
						mask="99.99.9999"
						type={ InputType.tel }
						placeholder="дд.мм.гггг"
					/>
				</FlexboxGrid>
				<NavigationButtons
					isMobile={ props.isMobile }
					handleSubmit={ props.handleSubmit }
					onPrevClick={ props.onPrevClick }
					isNextDisabled={ props.invalid }
				/>
			</FlexboxGrid>
		</form>
	)
};

const ConnectedAutoDocumentsForm = reduxForm<FormValues, AutoDocumentsProps>({
	form: OSAGO_FORM_NAME,
	validate,
	initialValues: FORM_INITIAL_VALUES,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
})(AutoDocuments);

function mapStateToProps(state: State) {
	return {
		// TODO после добавления валидации заменить на флаг валидности этого поля:
		licensePlate: selector(state, AutoIdentifierFieldNames.licensePlate),
	}
}

export default connect(
	mapStateToProps,
	{}
)(ConnectedAutoDocumentsForm)
