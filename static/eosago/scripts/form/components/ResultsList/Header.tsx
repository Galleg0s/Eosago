import {FlexboxGrid, Text} from 'react-ui-2018';
import { getPluralForm } from 'helpers';
import React from 'react';


const Header = ({ policies }: any) => {
	const eosagoPoliciesAmount = `${ getPluralForm(policies.length, ['полис', 'полиса', 'полисов'], false) } ОСАГО`;

	return (
		<div className="border-radius-top-default bg-white padding-hor-default padding-vert-small text-size-6">
			<FlexboxGrid alignItems="center" equalWidth>
				<Text tagName="span" weight="bolder">
					{ eosagoPoliciesAmount }
				</Text>
				<Text color="minor-black-lighten" tagName="span">Стоимость</Text>
			</FlexboxGrid>
		</div>
	)
};

export default Header;
