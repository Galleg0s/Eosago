import { schema } from 'normalizr';

import { resultSchema } from '../results';

export const resultsGroupSchema = { results: [resultSchema] };
