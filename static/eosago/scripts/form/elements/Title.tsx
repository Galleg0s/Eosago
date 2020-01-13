import React from 'react';

interface TitleProps {
	children: string | string[],
}

function Title(props: TitleProps) {
	return (
		<div className="text-align-center text-size-3 text-weight-bold">
			{props.children}
		</div>
	)
}

export default Title;
