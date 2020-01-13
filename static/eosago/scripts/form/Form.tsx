import React from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router';
import {SubmitHandler} from 'redux-form';
import {replace} from 'connected-react-router';
import { ProgressBar, Panel, FlexboxGrid } from 'react-ui-2018';
import {FormStep, PersonType, State} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import Auto from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Auto/Auto';
import AutoIdentifier
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/AutoIdentifier/AutoIdentifier';
import AutoDocuments
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/AutoDocuments/AutoDocuments';
import PhoneVerification
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/PhoneVerifiction/PhoneVerification';
import Drivers
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Drivers/Drivers';
import Person from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Person/Person';
import Passport from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Passport/Passport';
import Address from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Address/Address';
import PoliceDates
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/PoliceDates';
import DiagnosticCard
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/DiagnosticCard/DiagnosticCard';
import {
	goToNextStep,
	goToPrevStep,
	stepsSelector
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/formSteps';
import {
	getAutoIdRequest,
	isIdLoadingSelector,
	isAutoDataLoadingSelector
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/auto'
import {Paths} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/paths';
import Results from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/Results';
import {sendForm} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/form';
import styles from './Form.module.styl';
import FormSteps from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/FormSteps/FormSteps';

interface FormProps {
	steps: Array<FormStep>,
	currentStepIndex: number,
	goToNextStep: SubmitHandler<any, any>, // TODO
	goToPrevStep: Function,
	replace: Function,
	licensePlate?: string,
	getAutoIdRequest: Function,
	isIdLoading: boolean,
	isAutoDataLoading: boolean,
	isMobile: boolean
}

// TODO зарефакторить весь файл
const FORM_ROUTES = [
	{
		path: `${Paths.form}${FormStep.auto}`,
		render: (props: FormProps) =>
			<Auto
				isMobile={ props.isMobile }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.autoIdentifier}`,
		render: (props: FormProps) =>
			<AutoIdentifier
				isMobile={ props.isMobile }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.autoDocuments}`,
		render: (props: FormProps) =>
			<AutoDocuments
				isMobile={ props.isMobile }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.phoneVerification}`,
		render: (props: FormProps) =>
			<PhoneVerification
				isMobile={ props.isMobile }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.drivers}`,
		render: (props: FormProps) =>
			<Drivers
				isMobile={ props.isMobile }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.insurantGeneral}`,
		render: (props: FormProps) =>
			<Person
				isMobile={ props.isMobile }
				type={ PersonType.insurant }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.insurantPassport}`,
		render: (props: FormProps) =>
			<Passport
				isMobile={ props.isMobile }
				type={ PersonType.insurant }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.insurantAddress}`,
		render: (props: FormProps) =>
			<Address
				isMobile={ props.isMobile }
				type={ PersonType.insurant }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.ownerGeneral}`,
		render: (props: FormProps) =>
			<Person
				isMobile={ props.isMobile }
				type={ PersonType.owner }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.ownerPassport}`,
		render: (props: FormProps) =>
			<Passport
				isMobile={ props.isMobile }
				type={ PersonType.owner }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.ownerAddress}`,
		render: (props: FormProps) =>
			<Address
				isMobile={ props.isMobile }
				type={ PersonType.owner }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.policeDates}`,
		render: (props: FormProps) =>
			<PoliceDates
				isMobile={ props.isMobile }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	},
	{
		path: `${Paths.form}${FormStep.diagnosticCard}`,
		render: (props: FormProps) =>
			<DiagnosticCard
				isMobile={ props.isMobile }
				onPrevClick={ props.goToPrevStep }
				onSubmit={ props.currentStepIndex + 1 !== props.steps.length ? props.goToNextStep : sendForm }
			/>
	}
];

class Form extends React.Component<FormProps> {
	componentDidMount(): void {
		const { currentStepIndex, licensePlate, getAutoIdRequest, replace } = this.props;
		if (currentStepIndex === -1) {
			replace(`${Paths.form}${FormStep.auto}`);
		}

		if (licensePlate) {
			getAutoIdRequest(licensePlate);
		}
	}

	render() {
		const { steps, currentStepIndex, isIdLoading, isAutoDataLoading, isMobile } = this.props;
		const isFormLoading = isIdLoading || isAutoDataLoading;
		const progressBarProps = {
			max: steps.length,
			now: currentStepIndex + 1,
			showPercentage: false,
		};
		const stepsProps = {
			max: steps.length,
			now: currentStepIndex + 1,
			steps,
		}

		return (
			<FlexboxGrid direction="vert" gap={ isMobile ? 'zero' : 'default' }>
				{ isFormLoading && (
					<div className={ `${styles.spinner} bg-white` }>
						<div className="ui-loading-overlay-big ui-loading-hidden-content" />
					</div>
				)}

				{
					isMobile
					? <div className="padding-hor-default">
							<ProgressBar { ...progressBarProps } />
						</div>
					: <FormSteps { ...stepsProps } />
				}

				<div className={ styles.container }>
					<Panel
						noShadow={ isMobile }
						noRoundCorners={ isMobile }
						sections={
							<>
								{ FORM_ROUTES.map(
									route =>
										<Route
											path={ `${route.path}` }
											render={ () =>
												<route.render { ...this.props } />
											}
											key={ route.path }
										/>)
								}
								<Route path={ Paths.results } comoponent={ Results } />
							</>
					}
					/>
				</div>
			</FlexboxGrid>
		)
	}
}

function mapStateToProps(state: State) {
	const steps = stepsSelector(state);
	const matchSteps = steps.filter(((el: FormStep) => state.router.location.pathname.includes(el)));
	const currentStep = matchSteps.length ? matchSteps[matchSteps.length - 1] : matchSteps[0]
	const currentStepIndex = steps.indexOf(currentStep);
	const isAutoDataLoading = isAutoDataLoadingSelector(state);
	const isIdLoading = isIdLoadingSelector(state);

	return {
		steps,
		currentStepIndex,
		isAutoDataLoading,
		isIdLoading,
		currentStepIndex: steps.findIndex(((el: FormStep) => el === state.router.location.pathname.replace(Paths.form, ''))),
	};
}

const mapDispatchToProps = {
	goToNextStep,
	goToPrevStep,
	replace,
	getAutoIdRequest
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
