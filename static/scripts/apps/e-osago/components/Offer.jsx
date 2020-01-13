import React, { Component } from 'react';
import { Icon, Tooltip } from 'react-ui';

import classNames from 'classnames';
import { moneyFormat } from 'helpers';
import LeadOption from '../../auto/components/result-components/lead-option.jsx';

class Offer extends Component {

	render() {
		const { companyLogo, price, leadOptions, isMobile, kbmStatus, result } = this.props;
		const wrapperCls = classNames('bg-dark-desaturate', {
			'padding-top-default padding-right-medium padding-bottom-default padding-left-medium': !isMobile,
			'padding-small': isMobile
		});
		const headerDiscountTooltip = (
			<Icon name="attention-16" />
		);
		const childrenDiscountTooltip = (result || kbmStatus === 2) ?
			'Стоимость рассчитана с учётом скидок за безаварийное вождение, согласно КБМ указанных водителей' :
			'Стоимость будет уточнена в страховой компании после ввода данных водителей';
		const discountTitle = (result || kbmStatus === 2) ? 'стоимость с учетом скидок' : 'стоимость без учёта скидок';
		const offerPrice = typeof price === 'string' ?
			moneyFormat(Math.ceil(Number(price.replace(/\s/g, '').replace(/,/g, '.')))) :
			moneyFormat(Math.ceil(price));

		return (
			<div className={ wrapperCls }>
				<div className="grid__row grid__row--align-center">
					<div className="grid__cell grid__cell--min">
						<img className="display-block" src={ companyLogo } width="100" height="63" />
					</div>
					<div className="grid__cell">
						<div className="font-size-x-large font-bold text-align-center color-white">{ `${offerPrice} ₽` }</div>
						<div className="text-align-center color-white--alpha-60">
							{ discountTitle }
							<span className="margin-left-xx-small">
								<Tooltip
									header={ headerDiscountTooltip }
									children={ childrenDiscountTooltip }
									placement="bottom"
								/>
							</span>
						</div>
					</div>
					<div className="grid__cell grid__cell--min">
						<div className="grid__row grid__row--h-xxs">
							{leadOptions && leadOptions.length && leadOptions.map((leadOption, index) =>
								<LeadOption key={ index } image={ leadOption.image } content={ leadOption.tooltip } />
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Offer;
