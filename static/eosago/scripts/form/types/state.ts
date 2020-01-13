import {RouterState} from 'connected-react-router';
import {FormState} from 'redux-form';
import {
	BrandEntity,
	ModelEntity
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types/responses';

export enum FormStep {
	auto = '/auto',
	autoIdentifier = '/autoIdentifier',
	autoDocuments = '/autoDocuments',
	phoneVerification = '/phoneVerification',
	drivers = '/drivers',
	ownerGeneral = '/ownerGeneral',
	ownerPassport = '/ownerPassport',
	ownerAddress = '/ownerAddress',
	insurantGeneral = '/insurantGeneral',
	insurantPassport = '/insurantPassport',
	insurantAddress = '/insurantAddress',
	policeDates = '/policeDates',
	diagnosticCard = '/diagnosticCard',
}

export interface HomeState {
	licensePlate: string,
}

export interface FormStepsState {
	steps: Array<FormStep>,
}

export interface ModalsState {
	isAgreementModalVisible: boolean,
	isSubscribeModalVisible: boolean,
}

export interface PhoneVerificarionState {
	repeatCounter: number,
	didCodeRequested: boolean,
	isPhoneRequire: boolean,
	isCodeRequesting: boolean,
	didCodeSent: boolean,
	isCodeSending: boolean,
	isCodeValid: boolean,
}

export interface AutoCatalogState {
	brands: Array<BrandEntity>,
	isBrandsLoading: boolean,
	models: Array<ModelEntity>,
	isModelsLoading: boolean,
}

export interface AutoState {
	isAutoDataLoading: boolean,
	isIdLoading: boolean
}

export interface State {
	home: HomeState,
	formSteps: FormStepsState,
	modals: ModalsState,
	form: FormState,
	router: RouterState,
	phoneVerification: PhoneVerificarionState,
	autoCatalog: AutoCatalogState,
	auto: AutoState,
	results: any,
}
