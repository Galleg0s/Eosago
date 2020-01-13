import { schema } from 'normalizr';

import { packageSchema } from '../packages';
import { countrySchema } from '../countries';
import { companySchema } from '../companies';
import { optionSchema } from '../options/schemas';

export const calculationResultSchema = {
	company: companySchema,
	'package': packageSchema,
	calculateRequest: {
		countries: [countrySchema],
	},
};

export const crossSaleSchema = {
	option: optionSchema,
};
