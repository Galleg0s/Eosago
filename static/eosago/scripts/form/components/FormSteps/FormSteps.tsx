import React, { FC } from 'react';
import { FlexboxGrid } from 'react-ui-2018';
import StepItem, { BULLET_STATUSES } from './StepItem';
import { FormStep } from '../../types/state';

interface FormStepsProps {
	max: number;
	now: number;
	steps: any;
}

const STEPS = [
	{ text: 'Автомобиль', key: 0, interval: [
		FormStep.auto,
		FormStep.autoDocuments,
		FormStep.autoIdentifier,
	] },
	{ text: 'Водители', key: 1, interval: [
		FormStep.phoneVerification,
		FormStep.drivers,
		FormStep.ownerAddress,
		FormStep.ownerGeneral,
		FormStep.ownerPassport,
	] },
	{ text: 'Период и регион', key: 2, interval: [
		FormStep.policeDates,
		FormStep.diagnosticCard,
	] },
	{ text: 'Расчет', key: 3, interval: [] },
];

const FormSteps: FC<FormStepsProps> = (props) => {
	const currentInterval = STEPS.find(step =>
    step.interval.includes(props.steps[props.now - 1])
	);

	return (
		<FlexboxGrid justifyContent="center">
			{ STEPS.map((step, index) => {
				let status = BULLET_STATUSES.NOT_COMPLETE;
				if (currentInterval) {
					switch (true) {
						case currentInterval.key > index:
							status = BULLET_STATUSES.COMPLETE
							break;

						case currentInterval.key === index:
							status = BULLET_STATUSES.CURRENT
							break;

						default:
							break;
					}
				}
				return <StepItem { ...step } status={ status } />
			})}
		</FlexboxGrid>
	)
};

export default FormSteps;
