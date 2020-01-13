import React from 'react';
import { Icon } from 'react-ui';

function FormSection(props) {
	const { name, showSeparator, removeHandler, children } = props;

	return (
		<div className="grid__row grid__row--v-default">
			<div className="grid__cell grid__cell--12">
				<div className="font-size-large">
					{ name }
					{ removeHandler &&
						<Icon
							name="close"
							color="red"
							size="medium"
							saturate
							clickHandler={ removeHandler }
							className="padding-left-xx-small"
						/>
					}
				</div>
			</div>
			<div className="grid__cell grid__cell--12">
				{ children }
			</div>
			{ showSeparator &&
				<div className="grid__cell grid__cell--12">
					<div className="hor-content-separator margin-top-zero margin-bottom-x-small"></div>
				</div>
			}
		</div>
	);
}

export default FormSection;
