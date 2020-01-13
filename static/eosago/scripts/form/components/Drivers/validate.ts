import moment from 'moment';
import {
	ErrorTypes,
	getError
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/validation';
import {
	BIRTHDATE_CURRENT_YEAR_DIFF,
	DATE_INPUT_FORMAT, DATE_STRING_LENGTH, DRIVER_LICENSE_LENGTH, LICENSE_ISSUE_BIRTHDATE_DIFF, MAX_BIRTHDATE_DIFF,
	MAX_STRING_LENGTH,
	today
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {
	Driver,
	DriverFieldNames,
	FormValues
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export default function validate(values: FormValues) {
	const errors: any = {}; // TODO fix any

	if (values.drivers && values.drivers.length > 0) {
		const driversArrayErrors: any[] = []; // TODO fix any
		values.drivers.forEach((driver: Driver, driverIndex: number) => {
			const driverErrors: any = {}; // TODO fix any

			if (!driver[DriverFieldNames.firstname] || driver[DriverFieldNames.firstname].length === 0) {
				driverErrors[DriverFieldNames.firstname] = getError(DriverFieldNames.firstname, ErrorTypes.existing);
			} else if (driver[DriverFieldNames.firstname].length > MAX_STRING_LENGTH) {
				driverErrors[DriverFieldNames.firstname] = getError(DriverFieldNames.firstname, ErrorTypes.max);
			}

			if (!driver[DriverFieldNames.lastname] || driver[DriverFieldNames.lastname].length === 0) {
				driverErrors[DriverFieldNames.lastname] = getError(DriverFieldNames.lastname, ErrorTypes.existing);
			} else if (driver[DriverFieldNames.lastname].length > MAX_STRING_LENGTH) {
				driverErrors[DriverFieldNames.lastname] = getError(DriverFieldNames.lastname, ErrorTypes.max);
			}

			if (!driver[DriverFieldNames.middlename] || driver[DriverFieldNames.middlename].length === 0) {
				driverErrors[DriverFieldNames.middlename] = getError(DriverFieldNames.middlename, ErrorTypes.existing);
			} else if (driver[DriverFieldNames.middlename].length > MAX_STRING_LENGTH) {
				driverErrors[DriverFieldNames.middlename] = getError(DriverFieldNames.middlename, ErrorTypes.max);
			}

			if (!driver[DriverFieldNames.birthdate] || driver[DriverFieldNames.birthdate].length === 0) {
				driverErrors[DriverFieldNames.birthdate] = getError(DriverFieldNames.birthdate, ErrorTypes.existing);
			} else {
				if (driver[DriverFieldNames.birthdate].length !== DATE_STRING_LENGTH) {
					driverErrors[DriverFieldNames.birthdate] = getError(DriverFieldNames.birthdate, ErrorTypes.correct);
				} else {
					const birthDate = moment(driver[DriverFieldNames.birthdate], DATE_INPUT_FORMAT);
					if (!birthDate.isValid()) {
						driverErrors[DriverFieldNames.birthdate] = getError(DriverFieldNames.birthdate, ErrorTypes.correct);
					} else {
						if (moment(today).diff(birthDate, 'year') < BIRTHDATE_CURRENT_YEAR_DIFF) {
							driverErrors[DriverFieldNames.birthdate] = getError(DriverFieldNames.birthdate, ErrorTypes.max);
						}
						if (moment(today).diff(birthDate, 'year') > MAX_BIRTHDATE_DIFF) {
							driverErrors[DriverFieldNames.birthdate] = getError(DriverFieldNames.birthdate, ErrorTypes.min);
						}
					}
				}
			}

			if (!driver[DriverFieldNames.license] || driver[DriverFieldNames.license].length === 0) {
				driverErrors[DriverFieldNames.license] = getError(DriverFieldNames.license, ErrorTypes.existing);
			} else if (driver[DriverFieldNames.license].length !== DRIVER_LICENSE_LENGTH) {
				driverErrors[DriverFieldNames.license] = getError(DriverFieldNames.license, ErrorTypes.correct);
			}

			if (!driver[DriverFieldNames.licenseIssueDate] || driver[DriverFieldNames.licenseIssueDate].length === 0) {
				driverErrors[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.existing);
			} else {
				if (driver[DriverFieldNames.licenseIssueDate].length !== DATE_STRING_LENGTH) {
					driverErrors[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.correct);
				} else {
					const licenseIssueDate = moment(driver[DriverFieldNames.licenseIssueDate], DATE_INPUT_FORMAT);
					if (!licenseIssueDate.isValid()) {
						driverErrors[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.correct);
					} else {
						if (driver[DriverFieldNames.birthdate] && driver[DriverFieldNames.birthdate].length === DATE_STRING_LENGTH) {
							const birthDate = moment(driver[DriverFieldNames.birthdate], DATE_INPUT_FORMAT);
							if (birthDate.isValid()) {
								if (licenseIssueDate.diff(birthDate, 'year') < LICENSE_ISSUE_BIRTHDATE_DIFF) {
									driverErrors[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.max);
								}
							}
						}
						const licenseFirstIssueDate
							= driver[DriverFieldNames.licenseFirstIssueDate] && (driver[DriverFieldNames.licenseFirstIssueDate].length === DATE_STRING_LENGTH)
							? moment(driver[DriverFieldNames.licenseFirstIssueDate], DATE_INPUT_FORMAT)
							: null;
						if (licenseFirstIssueDate && !licenseIssueDate.isSameOrAfter(licenseFirstIssueDate)) {
							driverErrors[DriverFieldNames.licenseIssueDate] = getError(DriverFieldNames.licenseIssueDate, ErrorTypes.diff);
						}
					}
				}
			}

			if (!driver[DriverFieldNames.licenseFirstIssueDate] || driver[DriverFieldNames.licenseFirstIssueDate].length === 0) {
				driverErrors[DriverFieldNames.licenseFirstIssueDate] = getError(DriverFieldNames.licenseFirstIssueDate, ErrorTypes.existing);
			} else {
				if (driver[DriverFieldNames.licenseFirstIssueDate].length !== DATE_STRING_LENGTH) {
					driverErrors[DriverFieldNames.licenseFirstIssueDate] = getError(DriverFieldNames.licenseFirstIssueDate, ErrorTypes.correct);
				} else {
					if (driver[DriverFieldNames.licenseFirstIssueDate].length !== DATE_STRING_LENGTH) {
						driverErrors[DriverFieldNames.licenseFirstIssueDate] = getError(DriverFieldNames.licenseFirstIssueDate, ErrorTypes.correct);
					} else {
						const licenseFirstIssueDate = moment(driver[DriverFieldNames.licenseFirstIssueDate], DATE_INPUT_FORMAT);
						if (!licenseFirstIssueDate.isValid()) {
							driverErrors[DriverFieldNames.licenseFirstIssueDate] = getError(DriverFieldNames.licenseFirstIssueDate, ErrorTypes.correct);
						} else {
							if (driver[DriverFieldNames.birthdate] && driver[DriverFieldNames.birthdate].length === DATE_STRING_LENGTH) {
								const birthDate = moment(driver[DriverFieldNames.birthdate], DATE_INPUT_FORMAT);
								if (birthDate.isValid()) {
									if (licenseFirstIssueDate.diff(birthDate, 'year') < LICENSE_ISSUE_BIRTHDATE_DIFF) {
										driverErrors[DriverFieldNames.licenseFirstIssueDate] = getError(DriverFieldNames.licenseFirstIssueDate, ErrorTypes.max);
									}
								}
							}
						}
					}
				}
			}


			driversArrayErrors[driverIndex] = driverErrors;
		});
		if (driversArrayErrors.length) {
			errors.drivers = driversArrayErrors
		}
	}

	return errors;
}
