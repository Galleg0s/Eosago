import React from 'react';

import StepsContainer from '../containers/StepsContainer.jsx';
import StepsContentContainer from '../containers/StepsContentContainer.jsx';
import CarFormContainer from '../containers/CarFormContainer.jsx';
import InsurantFormContainer from '../containers/InsurantFormContainer.jsx';
import OwnerFormContainer from '../containers/OwnerFormContainer.jsx';
import OwnerIsAnInsurantTogglerContainer from '../containers/OwnerIsAnInsurantTogglerContainer.jsx';
import DriversFormContainer from '../containers/DriversFormContainer.jsx';
import MultidriveSwitcherContainer from '../containers/MultidriveSwitcherContainer.jsx';
import FormButtonsContainer from '../containers/FormButtonsContainer.jsx';
import AgreementFormContainer from '../containers/AgreementFormContainer.jsx';

const InputForm = (props) => {
	const { multidrive, isMobile, selectedStepIndex } = props;

	return (
		<div>
			<StepsContainer isMobile={ isMobile } />
			<StepsContentContainer>
				<InsurantFormContainer />
				<div>
					<OwnerIsAnInsurantTogglerContainer />
					<OwnerFormContainer />
				</div>
				<div>
					<MultidriveSwitcherContainer isMobile={ isMobile } />
					{ multidrive ?
						<div className="font-size-medium">
							Количество водителей не ограничено.
						</div> :
						<DriversFormContainer />
					}
				</div>
				<CarFormContainer />
			</StepsContentContainer>
			{ selectedStepIndex === 0 &&
				<AgreementFormContainer isMobile={ isMobile } />
			}
			<FormButtonsContainer />
		</div>
	);
};

export default InputForm;
