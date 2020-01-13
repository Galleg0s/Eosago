import React from 'react';
import {connect} from 'react-redux';
import { FlexboxGrid, FlexboxGridItem } from 'react-ui-2018';
import {Field, InjectedFormProps, reduxForm} from 'redux-form';
import {
	AutoFormFieldNames,
	BrandEntity,
	FormValues,
	ModelEntity,
	State
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import {normalizeInt} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';
import Input, {InputType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Input';
import NavigationButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import {
	FORM_INITIAL_VALUES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import validate
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Auto/validate';
import {
	brandsSelector,
	modelsSelector
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/autoCatalog';
import AutosuggestInputField
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/AutosuggestInput/AutosuggestInput';

export interface AutoFormProps {
	onPrevClick: Function,
	brands: Array<BrandEntity>,
	models: Array<ModelEntity>,
	isMobile: boolean,
}

const AutoForm: React.FC<AutoFormProps & InjectedFormProps<FormValues, AutoFormProps>> =
	({handleSubmit, onPrevClick, brands, models, invalid, isMobile}) => {
		const gridGap = isMobile ? 'small' : 'default';
		return (
			<form>
				<FlexboxGrid gap={ gridGap } direction="vert" >
					<Title>Автомобиль</Title>
					<FlexboxGrid gap={ gridGap } direction={ isMobile ? 'vert' : 'row' }>
						<FlexboxGridItem>
							<Field
								name={ AutoFormFieldNames.brand }
								component={ AutosuggestInputField }
								data={ brands }
								label="Марка"
							/>
						</FlexboxGridItem>
						<FlexboxGridItem>
							<Field
								name={ AutoFormFieldNames.year }
								normalize={ normalizeInt }
								component={ Input }
								label="Год выпуска"
								mask="9999"
								type={ InputType.tel }
							/>
						</FlexboxGridItem>
					</FlexboxGrid>
					<FlexboxGrid gap={ gridGap } direction={ isMobile ? 'vert' : 'row' }>
						<FlexboxGridItem>
							<Field
								name={ AutoFormFieldNames.model }
								component={ AutosuggestInputField }
								label="Модель"
								data={ models }
							/>
						</FlexboxGridItem>
						<FlexboxGridItem>
							<Field
								name={ AutoFormFieldNames.power }
								normalize={ normalizeInt }
								component={ Input }
								label="Мощность, л.с."
								type={ InputType.tel }
								mask="9999"
							/>
						</FlexboxGridItem>
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

const ConnectedAutoForm = reduxForm<FormValues, AutoFormProps>({
	form: OSAGO_FORM_NAME,
	initialValues: FORM_INITIAL_VALUES,
	validate,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
})(AutoForm);

function mapStateToProps(state: State) {
	return {
		models: modelsSelector(state),
		brands: brandsSelector(state),
	}
}

export default connect(
	mapStateToProps,
	{}
)(ConnectedAutoForm)
