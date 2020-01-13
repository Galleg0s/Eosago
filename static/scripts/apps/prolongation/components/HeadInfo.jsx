import React, { Fragment } from 'react';
import cx from 'classnames';
import { addLeadingZero } from 'helpers';
import { LOGO_ALFA } from '../constants';
import LOGO_ALFA_MOBILE from './alfa_mobile.svg';

export default function HeadInfo(props) {
	const { insurant, osagoPolicyStartDate } = props;
	const isMobile = banki.env.isMobileDevice;

	let osago_policy_finish_date = null;
	if (osagoPolicyStartDate) {
		osago_policy_finish_date = new Date(osagoPolicyStartDate.getFullYear() + 1, osagoPolicyStartDate.getMonth(), osagoPolicyStartDate.getDate() - 1);
		osago_policy_finish_date = `${addLeadingZero(osago_policy_finish_date.getDate())}.${addLeadingZero(osago_policy_finish_date.getMonth() + 1)}.${osago_policy_finish_date.getFullYear()}`;
	}

	return (
		<div className={ cx('bg-white', !isMobile ? 'padding-top-medium padding-bottom-medium' : 'padding-top-default padding-bottom-default') }>
			<div className="padding-left-default padding-right-default">
				<div className="flexbox flexbox--row flexbox--gap_default">
					{ !isMobile && (
						<Fragment>
							<div className="flexbox__item flexbox__item--min">
								<img className="border-default" src={ LOGO_ALFA } />
							</div>
							<div className="flexbox__item">
								<h1 className="text-size-2 text-weight-bold">
									Пролонгация от Альфастрахования
								</h1>
								{ insurant && osago_policy_finish_date && (
									<p className="text-size-6 margin-top-x-small-fixed">
										{ `${insurant.first_name} ${insurant.last_name}` }, ваш полис ОСАГО истекает { osago_policy_finish_date }
									</p>
								) }
							</div>
						</Fragment>
					) }
					{ isMobile && (
						<Fragment>
							<div className="flexbox__item">
								<h1 className="text-size-3 text-weight-bold text-uppercase">
									Пролонгация от Альфастрахования
								</h1>
							</div>
							<div className="flexbox__item flexbox__item--min">
								<img src={ LOGO_ALFA_MOBILE } />
							</div>
						</Fragment>
					) }
				</div>
				{ isMobile && insurant && osago_policy_finish_date && (
					<p className="text-size-3 margin-top-x-small-fixed">
						{ `${insurant.first_name} ${insurant.last_name}` }, ваш полис ОСАГО истекает { osago_policy_finish_date }
					</p>
				) }
			</div>
		</div>
	)
}
