import React from 'react';
import {Field, FormSection, InjectedFormProps, reduxForm} from 'redux-form';
import {FlexboxGrid} from 'react-ui-2018';
import NavigationButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import {
	FORM_INITIAL_VALUES,
	FORM_TITLES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import {
	AddressFieldNames,
	FormValues,
	PersonType
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import Input from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Input';
import AddressInput from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/AddressInput';
import validate from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Address/validate';

interface AddressProps {
	type: PersonType,
	onPrevClick: Function,
	isMobile: boolean,
}

const Address: React.FC<AddressProps & InjectedFormProps<FormValues, AddressProps>> = (props) => {
	return (
		<form>
			<FormSection name={ `${props.type}.address` }>
				<FlexboxGrid gap="small" direction="vert">
					<Title>Контактные данные { FORM_TITLES[props.type].address }</Title>
				<Field
					name={ AddressFieldNames.registration }
					label="Адрес регистрации"
					component={ AddressInput }
				/>
				<Field
					name={ AddressFieldNames.email }
					label="Электронная почта"
					component={ Input }
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

export default reduxForm<FormValues, AddressProps>({
	form: OSAGO_FORM_NAME,
	initialValues: FORM_INITIAL_VALUES,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate,
})(Address);
