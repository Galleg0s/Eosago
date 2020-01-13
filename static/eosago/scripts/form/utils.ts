import {WrappedFieldMetaProps} from 'redux-form';
import moment from 'moment';
import {
	AddressFieldNames,
	AutoDocumentType, BrandEntity,
	Driver,
	DriverFieldNames,
	FormValues, ModelEntity,
	Passport,
	PassportFieldNames,
	PersonFieldNames,
	PersonType
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {
	DATE_INPUT_FORMAT,
	DATE_ISO_FORMAT
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';

export function getValidationStatus({dirty, touched, error}: WrappedFieldMetaProps) {
	return touched && error ? {type: 'error', message: error} : undefined
}

export function normalizeInt(value: string) {
	return parseInt(value);
}

export function capitalizeFirstLetter(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export const formatFIOInputs = (value: string) => {
	if (value) {
		return capitalizeFirstLetter(value.replace(/[^а-яА-Я- ёЁ]/g, '').trim());
	}
	return value;
};

// https://momentjs.com/docs/#/parsing/string-format/
export const normalizeDate = (inputDate: string) => moment(inputDate, DATE_INPUT_FORMAT).format(DATE_ISO_FORMAT);

export const matchRegExp = (value: string, regexp: RegExp) => {
	const match = value && value.match(regexp);
	if (!match || !match[0] || match[0] !== match.input) {
		return false;
	}
	return true;
};

// TODO типизация дадаты
export const serializeAddressData = (address: any) => {
	return {
		postcode: address.postal_code,
		region_fias_id: address.region_fias_id,
		region_code_kladr: address.region_kladr_id,
		region_type: address.region_type,
		region: address.region,
		area_fias_id: address.area_fias_id,
		area_kladr_id: address.area_kladr_id,
		area_type: address.area_type,
		area: address.area,
		city_fias_id: address.city_fias_id,
		city_code_kladr: address.city_kladr_id,
		city_type: address.city_type,
		city: address.city,
		settlement_fias_id: address.settlement_fias_id,
		settlement_code_kladr: address.settlement_kladr_id,
		settlement_type: address.settlement_type,
		settlement: address.settlement,
		street_fias_id: address.street_fias_id,
		street_code_kladr: address.street_kladr_id,
		street_type: address.street_type,
		street: address.street,
		house_fias_id: address.house_fias_id,
		house_type: address.house_type,
		house: address.house,
		block_type: address.block_type,
		building: address.block,
		flat: address.flat,
		kladr_id: address.kladr_id,
		okato: address.okato,
	}
};

export const serializePassportData = (passport: Passport) => {
	const trimmedPassport = passport[PassportFieldNames.seriesNumber].replace(/\s+/g, '');
	return {
		series: trimmedPassport.slice(0, 4),
		number: trimmedPassport.slice(4),
		issue_date: normalizeDate(passport[PassportFieldNames.issueDate]),
		issued_by: passport[PassportFieldNames.emitent],
		issued_division: passport[PassportFieldNames.emitentCode]
	}
};

export const serializeDriversData = (drivers: Driver[]) => {
	return drivers.map((driver: Driver) => {
		const trimmedLicense = driver[DriverFieldNames.license].replace(/\s+/g, '');

		return {
			sex: 'm',
			first_name: driver[DriverFieldNames.firstname],
			last_name: driver[DriverFieldNames.lastname],
			patronymic: driver[DriverFieldNames.middlename],
			birthday: normalizeDate(driver[DriverFieldNames.birthdate]),
			license: {
				series: trimmedLicense.slice(0, 4),
				number: trimmedLicense.slice(4),
				first_issue_date: normalizeDate(driver[DriverFieldNames.licenseFirstIssueDate]),
				issue_date: normalizeDate(driver[DriverFieldNames.licenseIssueDate]),
			}
		}
	})
};

// TODO рефакторинг
export const serializeFormData = (values: FormValues, brands: BrandEntity[], models: ModelEntity[]) => {
	const {
		period,
		brand: brandId,
		model: modelId,
		dateStart,
		isSubscribe,
		power,
		year,
		licensePlate,
		vinNumber,
		bodyNumber,
		diagnosticCardNumber,
		diagnosticCardExpirationDate,
		autoDocumentSeriesNumber,
		autoDocumentIssueDate,
		phone,
		[PersonType.owner]: owner,
		[PersonType.insurant]: insurant,
		drivers,
		driversIsNoRestriction,
	} = values;

	const insurantAddress = serializeAddressData(insurant.address[AddressFieldNames.registration]);
	const ownerAddress = serializeAddressData(owner.address[AddressFieldNames.registration]);

	const brand = brands.find(b => b.id === brandId);
	const model = models.find(m => m.id === modelId);

	const ownerData = {
		sex: 'm',
		first_name: owner.person[PersonFieldNames.firstname],
		last_name: owner.person[PersonFieldNames.lastname],
		patronymic: owner.person[PersonFieldNames.middlename],
		birthday: normalizeDate(owner.person[PersonFieldNames.birthdate]),
		email: owner.address[AddressFieldNames.email],
		address_registration: ownerAddress,
		address_actual: ownerAddress,
		passport: serializePassportData(owner.passport),
	};

	const serializedDiagnosticCardExpirationDate = diagnosticCardExpirationDate === '' ? null : normalizeDate(diagnosticCardExpirationDate);
	const serializedInsurantBirthday = owner.person.isInsurant ? '' : normalizeDate(insurant.person[PersonFieldNames.birthdate]);
	const trimmedAutoDocumentSeriesNumber = autoDocumentSeriesNumber.replace(/\s+/g, '');

	return {
		company_id: 6,				// TODO поднять вопрос о переносе хардкода на бэк
		osago_period: period,
		osago_policy_start_date: dateStart,
		multidrive: driversIsNoRestriction,
		subscribe: isSubscribe,
		car: {
			brand_id: brand ? brand.id : null,
			brand_title: brand ? brand.name : null,
			model_id: model ? model.id : null,
			model_title: model ? model.name : null,
			power: power,
			license_plate: licensePlate,
			has_trailer: false,		// TODO в форме нет этого поля
			vin: vinNumber,
			body_number: bodyNumber,
			diagnostic_card_date_end: serializedDiagnosticCardExpirationDate,
			diagnostic_card_number: diagnosticCardNumber,
			year: year,
			vehicle_document: {
				series: trimmedAutoDocumentSeriesNumber.slice(0, 4),
				number: trimmedAutoDocumentSeriesNumber.slice(4),
				issue_date: normalizeDate(autoDocumentIssueDate),
				type: licensePlate ? AutoDocumentType.sts : AutoDocumentType.pts,
			}
		},
		owner: ownerData,
		insurant: owner.person.isInsurant ? {
			...ownerData,
			phone: `+7${phone}`,
		} : {
			sex: 'm',					// TODO поднять вопрос о переносе хардкода на бэк
			first_name: insurant.person[PersonFieldNames.firstname],
			last_name: insurant.person[PersonFieldNames.lastname],
			patronymic: insurant.person[PersonFieldNames.middlename],
			birthday: serializedInsurantBirthday,
			phone: `+7${phone}`,
			email: insurant.address[AddressFieldNames.email],
			address_registration: insurantAddress,
			address_actual: insurantAddress,
			passport: serializePassportData(insurant.passport)
		},
		drivers: !driversIsNoRestriction ? serializeDriversData(drivers) : [],
	}
};
