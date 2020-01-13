import { schema } from 'normalizr';
import { companySchema } from '../companies';
import { packageSchema } from '../packages';

export const resultSchema = new schema.Entity('results', {
	company: companySchema,
	'package': packageSchema,
}, {});
