import React from 'react';

import FormSection from '../layout/FormSection.jsx';
import DriverForm from '../components/DriverForm.jsx';

function DriversForm(props) {
	const { drivers, errors, partner_errors, addDriverHandler, removeDriverHandler, setPartnerErrorsHandler, changeHandler } = props;
	const driverCount = drivers.length;

	return (
		<div>
			{ drivers.map((driver, index) => {
				return (
					<FormSection
						key={ index }
						name={ `Водитель ${index + 1}` }
						removeHandler={ driverCount > 1 && removeDriverHandler.bind(null, index) }
						showSeparator
					>
						<DriverForm
							index={ index }
							data={ driver }
							errors={ errors[index] }
							partner_errors={ partner_errors }
							changeHandler={ changeHandler.bind(null, index) }
							setPartnerErrorsHandler={ setPartnerErrorsHandler }
						/>
					</FormSection>
				);
			})}
			{ drivers.length < 5 &&
				<div className="grid__row grid__row--v-default">
					<div className="grid__cell grid__cell--12">
						<div className="button button--bordered button--size_small" onClick={ addDriverHandler }>Добавить водителя</div>
					</div>
				</div>
			}
		</div>
	);
}

export default DriversForm;
