import React from 'react';
import classNames from 'classnames';

function ContentWrapper(props) {
	const { isMobile } = props;
	const wrapperCls = classNames('bg-white', {
		'padding-top-default padding-right-medium padding-bottom-default padding-left-medium': !isMobile,
		'padding-top-default padding-right-small padding-bottom-default padding-left-small': isMobile
	});

	return (
		<div className={ wrapperCls }>
			{ props.children }
		</div>
	);
}

export default ContentWrapper;
