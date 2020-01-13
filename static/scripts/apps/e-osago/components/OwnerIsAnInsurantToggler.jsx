import React from 'react';

function OwnerIsAnInsurantToggler(props) {
	const { value, changeHandler } = props;

	function changeEventHandler(event) {
		let target = event.target;
		let type = target.type;
		let valueProp = type === 'checkbox' ? 'checked' : 'value';
		let value = target[valueProp];

		changeHandler(value);
	}

	return (
		<div className="grid__row grid__row--h-xs grid__row--v-default margin-bottom-x-small">
			<div className="grid__cell grid__cell--12 grid__cell--sm-6">
				<div className="font-size-medium font-bold">
					Страхователь является собственником
				</div>
			</div>
			<div className="grid__cell grid__cell--12 grid__cell--sm-6">
				<label>
					<input type="checkbox" className="modern-checkbox" checked={ value } onChange={ changeEventHandler } />
					<span className="checkbox-label font-size-medium">&nbsp;</span>
				</label>
			</div>
		</div>
	);
}

export default OwnerIsAnInsurantToggler;
