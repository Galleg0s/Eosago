import React from 'react';
import classNames from 'classnames';
import './Steps.styl';

function Steps(props) {
	const { items, isMobile, selected } = props;
	const stepsCount = items.length;
	let renderSteps;

	if (isMobile) {
		items.forEach((item, index) => {
			if (index === selected) {
				renderSteps = (
					<div
						className={ classNames('e-osago-steps__item text-align-center e-osago-steps__item--selected', {
							'e-osago-steps__item--success': item.success
						}) }
						key={ index }
					>
						<div>{item.title}</div>
						<div className="color-gray-gray">Шаг { selected + 1 } из { stepsCount }</div>
					</div>
				)
			}
		})
	} else if (items && items.length) {
		renderSteps = items.map((item, index) =>
			<div className={ classNames('e-osago-steps__item grid__cell grid__cell--3', {
				'text-align-center': index > 0 && index < (items.length - 1),
				'text-align-right': index == (items.length - 1),
				'e-osago-steps__item--selected': index === selected,
				'e-osago-steps__item--success': item.success
			}) }
				key={ index }
			>
				<div>{ item.title }</div>
				<div className="e-osago-steps__indicator"></div>
			</div>
		)
	}

	return (
		<div className="padding-top-default padding-right-medium padding-left-medium">
			<div className={ classNames('e-osago-steps', {
				'e-osago-steps--mobile': isMobile,
				'grid__row grid__row--h-xl': !isMobile,
			}) }
			>
				{ renderSteps }
			</div>
		</div>
	);
}

export default Steps;
