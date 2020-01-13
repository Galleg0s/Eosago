import { createSelector } from 'reselect';
import { getPluralForm, moneyFormat } from 'helpers';
import { packageEntitiesSelector } from '../packages';
import { companyEntitiesSelector } from '../companies';
import { formatSum } from '../../../helpers';

export const resultEntitiesSelector = state => state.entities.results;

export const resultPackageSelector = createSelector(
	(state, result) => result.package,
	packageEntitiesSelector,
	(id, packages) => packages[id],
);

export const resultCompanySelector = createSelector(
	(state, result) => result && result.company,
	companyEntitiesSelector,
	(id, companies) => companies[id],
);

// Создаем фабрику для корректной мемоизации
export const makePriceSelector = (isRounded) => {
	return createSelector(
		(state, result, diffSum) => result && result.totalSum + diffSum,
		sumValue => `${moneyFormat(isRounded ? Math.ceil(sumValue) : sumValue)} ₽`,
	);
};

export const makeInsuranceAmountSelector = () => {
	return createSelector(
		(_, result) => result.insuranceAmount,
		(_, result) => result.insuranceAmountCurrency,
		(amount, currency) => formatSum(amount, currency),
	);
};

export const makeFranchiseSumSelector = () => {
	return createSelector(
		(_, result) => result,
		result => {
			if (result.medicalFranchise) {
				const sum = formatSum(result.medicalFranchise, result.insuranceAmountCurrency);
				return `франшиза ${sum}`;
			}
			// Считаем сколько опций имеет франшизу
			const franchiseOptions = result
				.companyOptions
				.reduce((sum, option) => option.franchise ? sum + 1 : sum , 0);
			if (franchiseOptions) {
				return `франшиза на ${getPluralForm(franchiseOptions, ['опцию', 'опции', 'опций'])}`;
			}
			return null;
		},
	);
};
