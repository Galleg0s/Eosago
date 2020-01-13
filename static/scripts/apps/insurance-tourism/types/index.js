import { shape, string, number } from 'prop-types';

export const countryType = shape({
	id: number.isRequired,
});

export const calculationResult = shape({
	id: number.isRequired,
});

export const packageType = shape({
	id: number.isRequired,
});

export const companyType = shape({
	id: number.isRequired,
	name: string.isRequired,
});

export const optionType = shape({
	id: number.isRequired,
});
