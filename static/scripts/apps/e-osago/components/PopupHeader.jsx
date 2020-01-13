import React from 'react';
import classNames from 'classnames';
import HeaderInfo from './HearedInfo.jsx';
import { Icon } from 'react-ui';

function PopupHeader(props) {
	const {
		onCloseHandler,
		isMobile,
		period,
		policyStartDate,
		policyStartDateMessage,
		changeHandler,
		setPartnerErrorsHandler,
		isFormSubmitted,
		partner_errors
	} = props;

	const wrapperCls = classNames('bg-white border-bottom-solid', {
		'padding-top-default padding-right-x-small padding-bottom-small padding-left-medium': !isMobile,
		'padding-top-x-small padding-right-small padding-bottom-x-small padding-left-small': isMobile
	});
	const titleCls = classNames('font-bold', {
		'font-size-x-large': !isMobile,
		'font-size-large-fixed': isMobile
	});

	return (
		<div className={ wrapperCls }>
			<div className="grid__row grid__row--align-center grid__row--h-xxs">
				<div className="grid__cell">
					<div className={ titleCls }>Покупка электронного полиса ОСАГО</div>
				</div>
				{ onCloseHandler &&
					<div className="grid__cell grid__cell--min">
						<Icon name="close" color="gray-blue" size={ isMobile ? 'small' : 'medium' } saturate clickHandler={ onCloseHandler } />
					</div>
				}
			</div>
			{ !isFormSubmitted &&
				<HeaderInfo
					isMobile={ isMobile }
					period={ period }
					policyStartDate={ policyStartDate }
					policyStartDateMessage={ policyStartDateMessage }
					partner_errors={ partner_errors }
					setPartnerErrorsHandler={ setPartnerErrorsHandler }
					changeHandler={ changeHandler }
				/>
			}
		</div>
	);
}

export default PopupHeader;
