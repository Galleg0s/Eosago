import {formValueSelector} from 'redux-form';
import {OSAGO_FORM_NAME} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';

export const selector = formValueSelector(OSAGO_FORM_NAME);
