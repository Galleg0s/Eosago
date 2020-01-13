import React from 'react';
import classNames from 'classnames';
import { Steps } from '../data.js';
import { gaCategory } from '../constants.js';
import { Icon } from 'react-ui';

function FormButtons(props) {
	const {
		currentStepIndex, isSubmitVisible, isSubmitAvailable, isPrevVisible, isNextVisible, isPrevAvailable,
		isNextAvailable, submitHandler, prevHandler, nextHandler, isMobile, isPhoneVerified
	} = props;

	const wrapperCls = classNames('bg-gray', {
		'padding-top-default padding-right-medium padding-bottom-default padding-left-medium': !isMobile,
		'padding-small': isMobile
	});
	const submitButtonCls = classNames('button button--theme_orange', {
		hidden: !isSubmitVisible,
		'button--size_small': isMobile
	});
	const prevButtonCls = classNames('button button--bordered button--icon-left', {
		hidden: !isPrevVisible,
		'button--size_small': isMobile
	});
	const nextButtonCls = classNames('button button--theme_blue button--icon-right margin-left-x-small', {
		hidden: !isNextVisible,
		'button--size_small': isMobile
	});

	const handlerWithGA = (handler) => (e) => {
		dataLayer.push({ event: 'GTM_event',
			eventCategory: gaCategory,
			eventAction: `e-OSAGO_${ Steps[currentStepIndex].formKey }_step_passed`,
			eventLabel: undefined,
			eventValue: undefined
		});
		handler(e);
	};

	return (
		<div className={ wrapperCls }>
			<div className="flexbox flexbox--justify-content_space-between">
				<div className="flexbox__item flexbox__item--min width-auto">
					<button
						type="button"
						className={ prevButtonCls }
						onClick={ prevHandler.bind(null, currentStepIndex) }
						disabled={ !isPrevAvailable }
					>
						<Icon name="arrow-previous" size="small" />
						{ !isMobile && 'Назад' }
					</button>
				</div>
				<div className="flexbox__item flexbox__item--min width-auto">
					<button
						key="send"
						type="button"
						className={ submitButtonCls }
						disabled={ !isSubmitAvailable }
						onClick={ handlerWithGA(submitHandler) }
					>
						{ !isMobile && 'Отправить' }
					</button>
					<button
						key="continue"
						type="button"
						className={ nextButtonCls }
						onClick={ handlerWithGA(nextHandler.bind(null, currentStepIndex)) }
						disabled={ !isNextAvailable || !isPhoneVerified }
					>
						{ !isMobile && 'Далее' }
						<Icon name="arrow-next" size="small" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default FormButtons;
