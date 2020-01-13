import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import MaskedInput from '../elements/MaskedInput.jsx';

class InputSeriesNumber extends Component {
	static propTypes = {
		name: PropTypes.string,
		values: PropTypes.arrayOf(PropTypes.string),
		errors: PropTypes.array,
		masks: PropTypes.arrayOf(PropTypes.string),
		onChange: PropTypes.func
	};

	constructor() {
		super();

		this._onChange = this._onChange.bind(this);
	}

	_onChange(event, fieldName) {
		const {onChange} = this.props;

		if (fieldName === 'series' && event.type !== 'change') {
			this.passportNumberInput.maskedInput.focus();
		}

		onChange && onChange(event);
	}

	render() {
		const {name, values, errors, masks, disabled} = this.props;
		const seriesName = name + '_series';
		const numberName = name + '_number';

		return (
			<div>
				<MaskedInput
					className={ classNames('input--medium-width', 'margin-right-x-small', {'input--alert': values.series !== undefined && errors[seriesName]}) }
					type="text"
					name={ seriesName }
					value={ values.series }
					mask={ masks.series }
					placeholder="серия"
					onChange={ (event) => {
						this._onChange(event, 'series')
					} }
					disabled={ disabled }
				/>
				<MaskedInput
					className={ classNames('input--medium-width', {'input--alert': values.number !== undefined && errors[numberName]}) }
					type="text"
					name={ numberName }
					value={ values.number }
					mask={ masks.number }
					placeholder="номер"
					onChange={ (event) => {
						this._onChange(event, 'number')
					} }
					ref={ (input) => {
						this.passportNumberInput = input;
					} }
					disabled={ disabled }
				/>
			</div>
		);
	}
}

export default InputSeriesNumber;
