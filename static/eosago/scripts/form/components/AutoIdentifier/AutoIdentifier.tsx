import React from 'react';
import {Field, InjectedFormProps, reduxForm, FormProps} from 'redux-form';
import {connect} from 'react-redux';
import { FlexboxGrid, FlexboxGridItem } from 'react-ui-2018';
import {
	AutoIdentifierFieldNames,
	FormValues,
	IdentifierType,
	State
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import Input from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Input';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import RadioButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/RadioButtons';
import NavigationButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import {
	FORM_INITIAL_VALUES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import validate
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/AutoIdentifier/validate';
import {selector} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form';


const IDENTIFIER_TYPE_ITEMS = [
	{
		value: IdentifierType.vin,
		title: 'VIN'
	},
	{
		value: IdentifierType.body,
		title: '№ кузова'
	}
];

export interface AutoIdentifierFormProps {
	onPrevClick: Function,
	identifierType: IdentifierType,
	isMobile: boolean,
}

export type AutoIdentifierPropsType = AutoIdentifierFormProps & InjectedFormProps<FormValues, AutoIdentifierFormProps>;

const AutoIdentifier: React.FC<AutoIdentifierPropsType> = (props) => {
	const gridGap = props.isMobile ? 'small' : 'default';
	// eslint-disable-next-line
	const getNumberField = () => {
		switch (props.identifierType) {
			case IdentifierType.body:
				return (
					<Field
						name={ AutoIdentifierFieldNames.bodyNumber }
						normalize={ (value: string) => value.toUpperCase().replace(/[А-Яа-яёЁ]/, '').trim() }
						mask="*************************"
						component={ Input }
						placeholder="Введите номер"
					/>
				);
			case IdentifierType.vin:
			default:
				return (
					<Field
						name={ AutoIdentifierFieldNames.vinNumber }
						normalize={ (value: string) => value.trim().toUpperCase() }
						component={ Input }
						mask="vvvvvvvvvvvvvvvvv"
						additionalFormatChars={ {
							v: '[wertyupasdfghjklzxcvbnmWERTYUPASDFGHJKLZXCVBNM0-9]'
						} }
						placeholder="Введите номер"
					/>
				)
		}
	};

	return (
		<form>
			<FlexboxGrid gap={ gridGap } direction="vert">
				<Title>Укажите VIN или номер кузова</Title>
				<Field
					name={ AutoIdentifierFieldNames.identifierType }
					component={ RadioButtons }
					data={ IDENTIFIER_TYPE_ITEMS }
				/>
				{ getNumberField() }
				<Title>Государственный номер</Title>
				<Field
					name={ AutoIdentifierFieldNames.licensePlate }
					normalize={ (value: string) => value.toUpperCase() }
					component={ Input }
					placeholder="А 000 АА 177"
					additionalFormatChars={ {
						g: '[АВЕКМНОРСТУХавекмнорстух]'
					} }
					mask="g 999 gg 999"
					useRawInputValue
				/>
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

const ConnectedAutoIdentifier = reduxForm<FormValues, AutoIdentifierFormProps>({
	form: OSAGO_FORM_NAME,
	initialValues: FORM_INITIAL_VALUES,
	validate,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
})(AutoIdentifier);

export default connect(
	(state: State) => {
		return {
			identifierType: selector(state, AutoIdentifierFieldNames.identifierType)
		}
	},
	{}
)(ConnectedAutoIdentifier)
