import React from 'react';
import {
	Field,
	FieldArray,
	GenericFieldArray,
	InjectedFormProps,
	reduxForm,
	WrappedFieldArrayProps,
	formValueSelector,
	change
} from 'redux-form';
import {connect, ConnectedProps} from 'react-redux';
import { Button, FlexboxGrid, FlexboxGridItem, Icon, Text } from 'react-ui-2018';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import Input, {InputType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Input';
import {formatFIOInputs} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';
import NavigationButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import {
	FORM_INITIAL_VALUES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import validate
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Drivers/validate';
import {
	DriverFieldNames,
	EmptyDriver,
	FormValues,
	State
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import CheckboxFormField
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Checkbox';
import { driversSelector, driversIsNoRestrictionSelector } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/drivers';

// https://stackoverflow.com/questions/49749060/how-do-i-use-types-defined-by-types-redux-form-in-react-component-with-field-an
const FieldArrayCustom = FieldArray as new () => GenericFieldArray<any, any>; // TODO fix any

// const RemoteSubmitButton = ({ dispatch, form }) => <button type="submit" onClick={() => dispatch( submit(form) ) }>Save</button>;
// export default connect()(RemoteSubmitButton)
interface RenderFieldProps {
	driversIsNoRestriction: boolean,
	onDriverRemoval: () => void,
	isMobile: boolean,
}

const renderField: React.FC<WrappedFieldArrayProps> = (props: WrappedFieldArrayProps & RenderFieldProps) => {
	const { fields, driversIsNoRestriction, onDriverRemoval, isMobile } = props;
	const gridGap = isMobile ? 'small' : 'default';
	const direction = isMobile ? 'vert' : 'row';

	return (
		<FlexboxGrid gap={ gridGap } direction="vert">
			{ isMobile && (
					<Title>Водители</Title>
				)
			}
			<div className="text-align-center">
				<Field
					name="driversIsNoRestriction"
					component={ CheckboxFormField }
					title="Без ограничений"
				/>
			</div>
			{
				// TODO отдельный компонент разделителя в гайд
				isMobile && (
					<hr className="hor-content-separator hor-content-separator--no-margins" />
				)
			}
			{!driversIsNoRestriction && fields.map((member: string, index: number) => {
				const removeDriver = () => {
					fields.remove(index);
					onDriverRemoval();
				};

				return (
					<React.Fragment key={ index }>
						<FlexboxGrid gap={ gridGap } direction="vert">
						<FlexboxGrid gap="xs" direction={ isMobile ? 'row' : 'vert' } justifyContent="space-between" alignItems="center">
								<Text
									size={ isMobile ? 4 : 3 }
									weight="bold"
								>
									{index + 1} водитель
								</Text>
								<span className="cursor-pointer" onClick={ removeDriver }>
									<FlexboxGrid gap="xxs" alignItems="center">
											<Icon
												type="trash"
												size="small"
												color="major-grey"
												displayAsBlock
											/>
										{ !isMobile && (
											<span className="text-size-7">Удалить</span>
										)}
									</FlexboxGrid>
								</span>
							</FlexboxGrid>
							<FlexboxGrid gap={ gridGap } direction={ direction } equalWidth>
								<Field
									name={ `${member}.${DriverFieldNames.lastname}` }
									type={ InputType.text }
									normalize={ formatFIOInputs }
									component={ Input }
									label="Фамилия"
								/>
								<Field
									type={ InputType.text }
									name={ `${member}.${DriverFieldNames.firstname}` }
									normalize={ formatFIOInputs }
									component={ Input }
									label="Имя"
								/>
								<Field
									type={ InputType.text }
									name={ `${member}.${DriverFieldNames.middlename}` }
									normalize={ formatFIOInputs }
									component={ Input }
									label="Отчество"
								/>
							</FlexboxGrid>
							<FlexboxGrid gap={ gridGap } direction={ direction } equalWidth>
								<Field
									name={ `${member}.${DriverFieldNames.birthdate}` }
									label="Дата рождения"
									component={ Input }
									mask="99.99.9999"
									type={ InputType.tel }
									placeholder="дд.мм.гггг"
								/>
								<Field
									name={ `${member}.${DriverFieldNames.license}` }
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
									name={ `${member}.${DriverFieldNames.licenseIssueDate}` }
									label="Дата выдачи текущих прав"
									component={ Input }
									mask="99.99.9999"
									type={ InputType.tel }
									placeholder="дд.мм.гггг"
								/>
							</FlexboxGrid>
							<FlexboxGrid gap={ gridGap } direction={ direction } alignItems="flex-end">
								<FlexboxGridItem>
								<Field
									name={ `${member}.${DriverFieldNames.licenseFirstIssueDate}` }
									label="Дата выдачи первых прав"
									component={ Input }
									mask="99.99.9999"
									type={ InputType.tel }
									placeholder="дд.мм.гггг"
								/>
								</FlexboxGridItem>
								<FlexboxGridItem>
								{ (index === (fields.length - 1)) && !driversIsNoRestriction &&
									<Button
										theme="transparent-light"
										fullWidth
										size={ isMobile ? 'large' : 'medium' }
										onClick={ () => {
											fields.push(EmptyDriver)
										} }
									>
										<FlexboxGrid gap="xs" alignItems="center" justifyContent="center">
											<Icon color="major-grey" type="user" />
											<span className="text-size-4">Добавить водителя</span>
										</FlexboxGrid>
									</Button>
								}
								</FlexboxGridItem>
								{ !isMobile && (<FlexboxGridItem />)}
							</FlexboxGrid>
						</FlexboxGrid>
						{ isMobile && (index !== (fields.length - 1)) &&
							// TODO отдельный компонент разделителя в гайд
							<hr className="hor-content-separator hor-content-separator--no-margins" />
						}
					</React.Fragment>
				)
			})}

		</FlexboxGrid>
	)
};

interface DriversProps {
	onPrevClick: Function,
	driversIsNoRestriction: boolean,
	//TODO: нормальная типизация
	drivers: any,
	dispatch: any,
	isMobile: boolean,
}

// eslint-disable-next-line
const Drivers: React.FC<DriversProps & InjectedFormProps<FormValues, DriversProps>> = (props) => {
	const handleDriverRemoval = () => {
		if (props.drivers.length <= 1) {
			props.dispatch(change(OSAGO_FORM_NAME, 'driversIsNoRestriction', true));
			// записываем в drivers пустого водителя, чтобы, если юзер отожмет чекбокс driversIsNoRestriction, ему не пришлось самому нажимать "Добавить водителя"
			props.dispatch(change(OSAGO_FORM_NAME, 'drivers', FORM_INITIAL_VALUES.drivers));
		}
	};

	return (
		<form>
			<FlexboxGrid gap={ props.isMobile ? 'small' : 'default' } direction="vert">
				<FieldArrayCustom
					isMobile={ props.isMobile }
					name="drivers"
					component={ renderField }
					driversIsNoRestriction={ props.driversIsNoRestriction }
					onDriverRemoval={ handleDriverRemoval }
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

const DriversForm = reduxForm<FormValues, DriversProps>({
	form: OSAGO_FORM_NAME,
	initialValues: FORM_INITIAL_VALUES,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate,
})(Drivers);

export default connect(
	(state: State) => {
		return {
			driversIsNoRestriction: driversIsNoRestrictionSelector(state),
			drivers: driversSelector(state)
		};
	},
	null
)(DriversForm);
