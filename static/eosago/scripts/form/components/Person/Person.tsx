import React from 'react';
import {connect} from 'react-redux';
import {Field, FormSection, InjectedFormProps, reduxForm} from 'redux-form';
import {Button, Icon, FlexboxGrid, Text, GridVertical} from 'react-ui-2018';
import {
	Driver, DriverFieldNames,
	FormValues, OwnerPerson,
	PersonFieldNames,
	PersonType,
	State
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import {
	FORM_INITIAL_VALUES,
	FORM_TITLES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import Input, {InputType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Input';
import NavigationButtons from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import CheckboxFormField from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Checkbox';
import {formatFIOInputs} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';
import {selector, setPerson} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form';
import validate from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Person/validate';

export type SuggestedPerson = Driver | OwnerPerson;

export interface PersonProps {
	type: PersonType,
	onPrevClick: Function,
	suggestedPersons: Array<SuggestedPerson>,
	driversIsNoRestriction: boolean;
	setPerson: (person: SuggestedPerson, type: PersonType) => void,
	isMobile: boolean,
}

const Person: React.FC<PersonProps & InjectedFormProps<FormValues, PersonProps>> = (props) => {
	const gridGap = props.isMobile ? 'small' : 'default';
	const direction = props.isMobile ? 'vert' : 'row';
	let hasSuggestedPersons = false;
	if (props.suggestedPersons.length) {
		hasSuggestedPersons = props.suggestedPersons.some(person => {
			for (const key in person) {
				if (person[key as keyof SuggestedPerson]) {
					return true;
				}
			}
		})
	}

	return (
		<form>
			<FormSection name={ `${props.type}.person` }>
				<FlexboxGrid gap={ gridGap } direction="vert">
					<Title>{ FORM_TITLES[props.type].person }</Title>
					{ props.type === PersonType.owner &&
						<FlexboxGrid alignItems="center" direction="vert">
							<Field
								name={ PersonFieldNames.isInsurant }
								component={ CheckboxFormField }
								title={ (<div className="color-minor-black-lighten">Является страхователем</div>) }
							/>
							{ props.isMobile && <hr className="hor-content-separator hor-content-separator--no-margins" /> }
						</FlexboxGrid>
					}
					{ (hasSuggestedPersons && !props.driversIsNoRestriction) &&
						<>
							<GridVertical>
								{ props.suggestedPersons.map((p: SuggestedPerson, index: number) => (
									<div key={ index }>
										<Button
											theme="transparent-light"
											onClick={ () => {
												props.setPerson(p, props.type);
											} }
											fullWidth
										>
											<FlexboxGrid alignItems="center" gap="xs">
												<Icon color="major-grey" type="add" displayAsBlock />
												<Text weight="bold">
													{ p[PersonFieldNames.lastname] } {p[PersonFieldNames.firstname]} {p[PersonFieldNames.middlename]}
												</Text>
											</FlexboxGrid>
										</Button>
									</div>
								)) }
							</GridVertical>
							<hr className="hor-content-separator hor-content-separator--no-margins" />
						</>
					}
					<FlexboxGrid gap={ gridGap } direction={ direction } equalWidth>
						<Field
							name={ PersonFieldNames.firstname }
							normalize={ formatFIOInputs }
							label="Имя"
							component={ Input }
						/>
						<Field
							name={ PersonFieldNames.lastname }
							normalize={ formatFIOInputs }
							label="Фамилия"
							component={ Input }
						/>
						<Field
							name={ PersonFieldNames.middlename }
							normalize={ formatFIOInputs }
							label="Отчество"
							component={ Input }
						/>
					</FlexboxGrid>
					<FlexboxGrid gap={ gridGap } direction={ direction } equalWidth>
						<Field
							name={ PersonFieldNames.birthdate }
							label="Дата рождения"
							component={ Input }
							mask="99.99.9999"
							type={ InputType.tel }
							placeholder="дд.мм.гггг"
						/>
						<Field
							name={ DriverFieldNames.license }
							label="Водительское удостоверение"
							normalize={ (value: string) => value.toUpperCase() }
							component={ Input }
							mask="99 xx 999999"
							additionalFormatChars={ {
								x: '[0-9А-яа-я]'
							} }
							type={ InputType.text }
							placeholder="Серия и номер"
						/>
						<Field
							name={ DriverFieldNames.licenseIssueDate }
							label="Дата выдачи текущих прав"
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
			</FormSection>
		</form>
	)
};

const PersonForm = reduxForm<FormValues, PersonProps>({
	form: OSAGO_FORM_NAME,
	validate,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	initialValues: FORM_INITIAL_VALUES,
})(Person);

function mapStateToProps(state: State, ownProps: PersonProps) {
	const { type } = ownProps;
	const drivers: Array<Driver> = selector(state, 'drivers');
	const driversIsNoRestriction: boolean = selector(state, 'driversIsNoRestriction');
	const suggestedPersons: Array<Driver | OwnerPerson> = drivers ? [...drivers] : [];
	if (type === PersonType.insurant) {
		const owner = selector(state, PersonType.owner);
		suggestedPersons.push(owner.person);
	}
	return {
		suggestedPersons,
		driversIsNoRestriction
	};
}

export default connect(mapStateToProps, { setPerson })(PersonForm);
