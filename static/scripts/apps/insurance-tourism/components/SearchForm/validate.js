export default function validate(values) {
	const errors = {};
	// const { startDate, endDate } = values.dates;
	if (!values.dates) {
		errors.dates = 'Выберите дату поездки';
	}
	if (values.yearPolicy) {
		if (values.dates) {
			if (!values.dates.startDate) {
				errors.dates = 'Выберите дату начала поездки';
			}
		}
		if (!values.insuranceDaysCount) {
			errors.insuranceDaysCount = 'Выберите количество дней поездки';
		}
	} else {
		if (values.dates) {
			if (!values.dates.startDate || !values.dates.endDate) {
				errors.dates = 'Выберите даты начала и окончания поездки';
			}
		}
	}
	if (!values.tourists || !values.tourists.length) {
		errors.tourists = { _error: 'Необходимо указать хотя бы одного туриста' }
	} else {
		const touristsArrayErrors = [];
		values.tourists.forEach((item, index) => {
			const touristErrors = {};
			if (!item || !item.age) {
				touristErrors.age = 'Возраст';
				touristsArrayErrors[index] = touristErrors;
			}
		});
		if (touristsArrayErrors.length) {
			errors.tourists = { _error: 'Возраст', ...touristsArrayErrors };
		}
	}
	if (!values.countries || !values.countries.length) {
		errors.countries = 'Выберите страну';
	}
	return errors;
}
