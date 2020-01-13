import React from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { ContainerQuery } from 'react-container-query';
import s from './PolicyPrice.module.styl';

const query = {
	md: {
		minWidth: 321
	},
	/** макет 320 */
	xs: {
		maxWidth: 320
	}
};

export default function PolicyPrice({ price, isRecalculating }) {
	return (
		<ContainerQuery query={ query }>
			{ params =>
				<div className={ cx(s.root, params.xs && 'text-size-6') }>
					<div className="text-align-center bg-minor-black-lighten2 padding-default">
						{ isRecalculating ? 'Пересчет стоимости полиса...' : 'Стоимость полиса' }
						<div className={ cx(params.xs ? 'text-size-3' : 'text-size-2', 'text-weight-bold', 'color-major-green', 'margin-top-x-small') }>
							{ isRecalculating ? (<div className="ui-loader-icon ui-loader-icon-medium" />) : price }
						</div>
					</div>
				</div>
			}
		</ContainerQuery>
	);
}

PolicyPrice.propTypes = {
	price: T.string,
};
