import React from 'react';
import {connect} from 'react-redux';
import { Button, FlexboxGrid, FlexboxGridItem, Icon, Link } from 'react-ui-2018';
import {FormStep, State} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {stepsSelector} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/formSteps';
import { getResultInfoRequestStatus } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/selectors';
import { REQUEST_STATUS } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/constants';
import { RequestStatus } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/types';

interface NavigationButtonsProps {
	handleSubmit: Function,
	onPrevClick: Function,
	isNextDisabled?: boolean,
	currentStepIndex: number,
	steps: Array<FormStep>,
	resultInfoRequestStatus: RequestStatus,
	isMobile?: boolean,
}

function NavigationButtons(props: NavigationButtonsProps) {
	const isLoading = props.resultInfoRequestStatus === REQUEST_STATUS.PENDING;
	return (
		<FlexboxGrid alignItems="center" direction="vert" gap="default">
			<FlexboxGridItem min={ !props.isMobile }>
				<Button
					size="large"
					onClick={ !isLoading && props.handleSubmit }
					disabled={ props.isNextDisabled }
					fullWidth={ props.isMobile }
					isLoading={ isLoading }
				>
					{ props.currentStepIndex + 1 !== props.steps.length
						? <>Дальше{ ' ' }<Icon type="arrow-next" /></>
						: 'Подобрать страховку' }
				</Button>
			</FlexboxGridItem>
			{ props.currentStepIndex !== 0 &&
				<FlexboxGridItem min>
					<Link
						theme="alt"
						onClick={ props.onPrevClick }
					>
						Назад
					</Link>
				</FlexboxGridItem>
			}
		</FlexboxGrid>
	)
}

function mapStateToProps(state: State) {
	const steps = stepsSelector(state);
	const resultInfoRequestStatus = getResultInfoRequestStatus(state);
	const matchSteps = steps.filter(((el: FormStep) => state.router.location.pathname.includes(el)));
	const currentStep = matchSteps.length ? matchSteps[matchSteps.length - 1] : matchSteps[0]
	const currentStepIndex = steps.indexOf(currentStep);
	return {
		steps,
		currentStepIndex,
		resultInfoRequestStatus,
	}
}

export default connect(mapStateToProps, {})(NavigationButtons);
