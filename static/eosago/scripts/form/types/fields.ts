import {IdentifierType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export enum PersonType {
	insurant = 'insurant',
	owner = 'owner',
}

export const enum AutoFormFieldNames {
	brand = 'brand',
	year = 'year',
	model = 'model',
	power = 'power',
}

export const enum AutoIdentifierFieldNames {
	identifierType = 'identifierType',
	licensePlate = 'licensePlate',
	vinNumber = 'vinNumber',
	bodyNumber = 'bodyNumber',
}

export const enum PhoneVerificationFieldNames {
	phone = 'phone',
	// isAgreement = 'isAgreement',
	isSubscribe = 'isSubscribe',
	code = 'code',
}

export const enum DiagnosticCardFieldNames {
	number = 'diagnosticCardNumber',
	expirationDate = 'diagnosticCardExpirationDate',
}

export const enum PoliceDatesFieldNames {
	period = 'period',
	dateStart = 'dateStart',
}

export const enum AutoDocumentsFiledNames {
	seriesNumber = 'autoDocumentSeriesNumber',
	issueDate = 'autoDocumentIssueDate',
}

// TODO рефакторинг типизации водители, страхователь, собственние имеют общие поля
export const enum DriverFieldNames {
	firstname = 'firstname',
	middlename = 'middlename',
	lastname = 'lastname',
	birthdate = 'birthdate',
	license = 'license',
	licenseIssueDate = 'licenseIssueDate',
	licenseFirstIssueDate = 'licenseFirstIssueDate',
}

export interface Driver {
	[DriverFieldNames.firstname]: string,
	[DriverFieldNames.middlename]: string,
	[DriverFieldNames.lastname]: string,
	[DriverFieldNames.birthdate]: string,
	[DriverFieldNames.license]: string,
	[DriverFieldNames.licenseIssueDate]: string,
	[DriverFieldNames.licenseFirstIssueDate]: string,
}

export const EmptyDriver = {
	[DriverFieldNames.firstname]: '',
	[DriverFieldNames.lastname]: '',
	[DriverFieldNames.middlename]: '',
	[DriverFieldNames.birthdate]: '',
	[DriverFieldNames.license]: '',
	[DriverFieldNames.licenseIssueDate]: '',
	[DriverFieldNames.licenseFirstIssueDate]: '',
};

export const enum PersonFieldNames {
	isInsurant = 'isInsurant',
	firstname = 'firstname',
	lastname = 'lastname',
	middlename = 'middlename',
	birthdate = 'birthdate',
}

export interface Person {
	[PersonFieldNames.firstname]: string,
	[PersonFieldNames.lastname]: string,
	[PersonFieldNames.middlename]: string,
	[PersonFieldNames.birthdate]: string,
	[DriverFieldNames.license]?: string,
	[DriverFieldNames.licenseIssueDate]?: string,
	[DriverFieldNames.licenseFirstIssueDate]?: string,
}

export const enum PassportFieldNames {
	seriesNumber = 'seriesNumber',
	emitentCode = 'emitentCode',
	emitent = 'emitent',
	issueDate = 'issueDate',
}

export interface Passport {
	[PassportFieldNames.seriesNumber]: string,
	[PassportFieldNames.emitentCode]: string,
	[PassportFieldNames.emitent]: string,
	[PassportFieldNames.issueDate]: string,
}

export const enum AddressFieldNames {
	email = 'email',
	registration = 'registration',
}

export interface Address {
	[AddressFieldNames.email]: string,
	[AddressFieldNames.registration]?: any, // TODO fix any
}

export interface OwnerPerson extends Person {
	[PersonFieldNames.isInsurant]: boolean,
}

export interface FormValues {
	[AutoFormFieldNames.brand]?: number,
	[AutoFormFieldNames.year]: string,
	[AutoFormFieldNames.model]?: number,
	[AutoFormFieldNames.power]: string,
	[AutoDocumentsFiledNames.seriesNumber]: string,
	[AutoDocumentsFiledNames.issueDate]: string,
	[AutoIdentifierFieldNames.identifierType]: IdentifierType,
	[AutoIdentifierFieldNames.vinNumber]: string,
	[AutoIdentifierFieldNames.bodyNumber]: string,
	[AutoIdentifierFieldNames.licensePlate]: string,
	[PhoneVerificationFieldNames.phone]: string,
	[PhoneVerificationFieldNames.code]: string,
	[PhoneVerificationFieldNames.isSubscribe]: boolean,
	// [PhoneVerificationFieldNames.isAgreement]: boolean,
	[PoliceDatesFieldNames.period]: number,
	[PoliceDatesFieldNames.dateStart]?: string,
	[DiagnosticCardFieldNames.number]: string,
	[DiagnosticCardFieldNames.expirationDate]: string,
	driversIsNoRestriction: boolean,
	drivers: Driver[],
	[PersonType.owner]: {
		person: OwnerPerson,
		passport: Passport,
		address: Address
	},
	[PersonType.insurant]: {
		person: Person,
		passport: Passport,
		address: Address,
	},
}

