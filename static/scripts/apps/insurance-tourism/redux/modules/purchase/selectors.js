import { createSelector } from 'reselect';
import moment from 'moment';
import { formValueSelector } from 'redux-form';
import { getPluralForm } from 'helpers';
import { formatSum } from '../../../helpers';
import { PURCHASE_FORM_NAME } from './constants';
import { companyEntitiesSelector } from '../companies';
import { resultEntitiesSelector } from '../results';
import { countryEntitiesSelector } from '../countries';
import { packageEntitiesSelector } from '../packages';
import { optionEntitiesSelector } from '../options';

const resultIdSelector = state => state.purchase.result;

export const requestSelector = state => state.purchase.request;
export const isLoadingSelector = state => state.purchase.isLoading;
export const fetchingPoliciesSelector = state =>
	state.purchase.isFetchingPolicies;
export const policiesSelector = state => state.purchase.policies;
export const insurerSelector = state => state.purchase.insurer;
export const insuredListSelector = state => state.purchase.insuredList;
export const isPaymentProcessingSelector = state => state.purchase.isPaymentProcessing;
export const isFetchingCrossSalesSelector = state => state.purchase.isFetchingCrossSales;
export const diffSumSelector = state => state.purchase.diffSum;
export const recalculatingSelector = state => state.purchase.isRecalculating;
export const paymentStatusSelector = state => state.purchase.status;
export const paymentErrorSelector = state => state.purchase.error;
export const assistanceCompaniesSelector = state => state.purchase.assistanceCompanies;
export const purchaseResultIdSelector = state => state.purchase.resultId;
export const preliminaryResultIdSelector = state => state.purchase.preliminaryResultId;
export const priceValueSelector = (state, round = false) => round
	? Math.ceil(state.purchase.totalSum)
	: state.purchase.totalSum;
export const optionsSelector = state => state.purchase.options;
export const insuranceAmountCurrencySelector = state => state.purchase.insuranceAmountCurrency;

export const calculationResultSelector = createSelector(
	resultIdSelector,
	resultEntitiesSelector,
	(id, results) => results[id],
);

export const countriesSelector = createSelector(
	requestSelector,
	countryEntitiesSelector,
	(request, countries) =>
		request && request.countries.map(id => countries[id]),
);

export const hasSchengenSelector = createSelector(
	countriesSelector,
	countries => countries && countries.filter(item => item.shengen).length > 0,
);

export const durationSelector = createSelector(
	requestSelector,
	request => {
		const startDate = moment(request.startDate);
		const endDate = moment(request.endDate);
		const diff = endDate.diff(startDate, 'days') + 1;
		const duration = getPluralForm(diff, ['день', 'дня', 'дней']);
		return `${!request.yearPolicy ? duration : 'Один год'} (c ${startDate.format('L')} по ${endDate.format('L')})`;
	},
);

export const totalSumSelector = createSelector(
	priceValueSelector,
	sumValue => formatSum(sumValue, 'RUB'),
);

export const franchiseSumSelector = createSelector(
	state => state.purchase.franchiseSum,
	state => state.purchase.insuranceAmountCurrency,
	state => state.purchase.options,
	(sumValue, currency, options) => {
		if (sumValue) {
			return `франшиза ${formatSum(sumValue, currency)}`
		}
		// Считаем сколько опций имеет франшизу
		const franchiseOptions = options
			.reduce((sum, option) => option.franchise ? sum + 1 : sum , 0);
		if (franchiseOptions) {
			return `франшиза на ${getPluralForm(franchiseOptions, ['опцию', 'опции', 'опций'])}`;
		}
		return null;
	},
);

export const purchaseCompanySelector = createSelector(
	state => state.purchase.company,
	companyEntitiesSelector,
	(companyId, companyEntities) => companyId && companyEntities[companyId],
);

export const purchasePackageSelector = createSelector(
	state => state.purchase.package,
	packageEntitiesSelector,
	(packageId, packageEntities) => packageId && packageEntities[packageId],
);

export const purchaseInsuranceAmountSelector = createSelector(
	state => state.purchase.insuranceAmount,
	state => state.purchase.insuranceAmountCurrency,
	(insAmount, currency) => formatSum(insAmount, currency)
);

export const crossSalesSelector = createSelector(
	state => state.purchase.crossSales,
	optionEntitiesSelector,
	(crossSales, optionsEntities) => crossSales && crossSales.map(item => ({
		...item,
		option: optionsEntities[item.option],
	})),
);

export const purchaseFormValueSelector = formValueSelector(PURCHASE_FORM_NAME);
export const insuredListFormValueSelector = state => purchaseFormValueSelector(state, 'insuredList');
export const insuredBirthDatesSelector = createSelector(
	insuredListFormValueSelector,
	tourists => tourists.map(item => item.birthDate),
);

export const isBirthDatesFilledSelector = createSelector(
	insuredListFormValueSelector,
	insuredList => {
		if (!insuredList) {
			return false;
		}
		return !insuredList.some(item => !item.birthDate || item.birthDate.split('_').length > 1);
	},
);
