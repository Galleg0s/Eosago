import React from 'react';
import {WrappedFieldProps} from 'redux-form';
import {FormField, SimpleSelect} from 'react-ui-2018';
import {BrandEntity, ModelEntity} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {PeriodItem} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/PoliceDates';
import {getValidationStatus} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';

type SelectorDataEntity = ModelEntity | BrandEntity | PeriodItem;

interface SelectorProps {
	label: string,
	data: Array<SelectorDataEntity>,
}

interface SelectHandlerValue {
	id: number,
	content: string,
}

const getData = (rawData: Array<SelectorDataEntity>): Array<SelectHandlerValue> =>
	rawData.map((item) => ({id: item.id, content: item.name}));

const Selector =
	({label, data, input: { value, onChange }, meta}: WrappedFieldProps & SelectorProps) => (
			<FormField
				label={ label }
				size="medium"
				component={ SimpleSelect }
				data={ getData(data) }
				selectedId={ value }
				selectHandler={ (_: any, v: SelectHandlerValue) => onChange(v.id) }
				status={ getValidationStatus(meta) }
			/>
		);

export default Selector;
